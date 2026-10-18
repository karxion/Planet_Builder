import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Run with FPB_PYTHON pointing to Python with pdfplumber; PDFs remain build-time inputs only.
const sources = [
  { edition: "2014", path: "tmp/item-catalog/srd51.pdf", hash: "2504d2a0abb0a4d491a939be4f17910a2dde0312570ab8d208080225ccf0a1f0" },
  { edition: "2024", path: "tmp/item-catalog/srd521.pdf", hash: "8974902d109d6e63672d7c490bde9ccf052410503d9cfa768237154fbc5e3d87" }
];
for (const source of sources) {
  if (createHash("sha256").update(readFileSync(source.path)).digest("hex") !== source.hash) throw new Error(`Unverified PDF: ${source.edition}`);
}

const program = String.raw`
import sys,json,re,pdfplumber
records=[]
for edition,path,start,end in [('2014',sys.argv[1],206,253),('2024',sys.argv[2],208,253)]:
    pdf=pdfplumber.open(path)
    current=None
    def finish():
        if not current: return
        current['metadata']=current['metadata'].strip()
        if not current['metadata']: return
        if not re.match(r'^(Armor|Weapon|Potion|Ring|Rod|Staff|Wand|Scroll|Wondrous)', current['metadata'], re.I):
            raise ValueError('Missing item metadata: '+str(current))
        current['rules']=re.sub(r'(?<=\w)-\n(?=\w)', '', '\n'.join(current['rules']))
        records.append(current.copy())
    for index in range(start,end):
        page=pdf.pages[index]
        for column in [0,1]:
            chars=[c for c in page.chars if (c['x0']<page.width/2)==(column==0) and 28<page.height-c['matrix'][5]<735]
            rows=[]
            for char in sorted(chars,key=lambda c:(round((page.height-c['matrix'][5])*2)/2,c['x0'])):
                y=page.height-char['matrix'][5]
                if not rows or abs(rows[-1][0]-y)>1.1: rows.append([y,[]])
                rows[-1][1].append(char)
            for y,cs in rows:
                cs.sort(key=lambda c:c['x0'])
                text=''
                right=None
                for c in cs:
                    if right is not None and c['x0']-right>1.5: text+=' '
                    text+=c['text']
                    right=c['x1']
                text=re.sub(r'\s+',' ',text.replace('\u00ad','').replace('\x02','-')).strip()
                if not text: continue
                if text in ['Sentient Magic Items','Artifacts']:
                    finish()
                    current=None
                    continue
                visible=[c for c in cs if c['text'].strip()]
                heading=bool(visible) and all('GillSans-SemiBold' in c['fontname'] and abs(c['size']-12)<0.2 for c in visible)
                italic=bool(visible) and all('Italic' in c['fontname'] for c in visible)
                if heading:
                    if current and not current['metadata'] and not current['rules']:
                        current['name']+=' '+text
                    else:
                        finish()
                        current={'edition':edition,'name':text,'metadata':'','rules':[],'page':index+1,'endPage':index+1}
                elif current:
                    current['endPage']=index+1
                    if italic and not current['rules']: current['metadata']+=' '+text
                    else: current['rules'].append(text)
        page.close()
    finish()
print(json.dumps(records,ensure_ascii=True))
`;

const result = spawnSync(process.env.FPB_PYTHON || "python", ["-X", "utf8", "-c", program, ...sources.map(s => s.path)], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
if (result.status !== 0) throw new Error(result.stderr || "PDF catalog extraction failed");
const items = JSON.parse(result.stdout) as { edition: string; name: string; metadata: string; rules: string; page: number; endPage: number }[];
const rarityMap: Record<string, string> = { common: "common", uncommon: "uncommon", rare: "rare", "very rare": "veryRare", legendary: "legendary", artifact: "artifact" };
const records = items.map(item => {
  const metadata = item.metadata.trim();
  const slug = item.name.normalize("NFKD").replace(/[’']/g, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase();
  const category = metadata.match(/^(Armor|Weapon|Potion|Ring|Rod|Staff|Wand|Scroll|Wondrous)/i)![1].toLowerCase();
  const rarityVaries = /rarity (varies|by)|,\s*varies/i.test(metadata);
  const rarities = [...new Set([...metadata.matchAll(/\b(very rare|uncommon|common|rare|legendary|artifact)\b/gi)].map(match => rarityMap[match[0].toLowerCase()]))];
  return { id: `srd${item.edition === "2014" ? "51" : "521"}:${slug}`, ...item, metadata, category, rarities,
    rarityVaries, attunement: /requires attunement/i.test(metadata) };
});
if (new Set(records.map(item => item.id)).size !== records.length) throw new Error("Duplicate item IDs");
for (const edition of ["2014", "2024"]) {
  const items = records.filter(item => item.edition === edition);
  if (items.length !== (edition === "2014" ? 240 : 258) || !items.some(item => item.name === "Amulet of Health") || !items.some(item => item.name === "Wings of Flying")) throw new Error(`Incomplete catalog: ${edition}`);
}
writeFileSync("src/data/srd-magic-items.generated.ts", `// Generated from pinned official CC BY 4.0 SRDs by scripts/build-magic-item-catalog.ts.\nimport type { MagicItemReference } from "@/types/magic-item-reference";\nexport const SRD_MAGIC_ITEMS: readonly MagicItemReference[] = ${JSON.stringify(records, null, 2)};\n`);
const formatted = spawnSync(process.execPath, [
  "node_modules/@biomejs/biome/bin/biome", "format", "--write", "src/data/srd-magic-items.generated.ts"
], { encoding: "utf8" });
if (formatted.status !== 0) throw new Error(formatted.stderr || formatted.error?.message || "Catalog formatting failed");
process.stdout.write(JSON.stringify({ counts: Object.fromEntries(sources.map(s => [s.edition, records.filter(r => r.edition === s.edition).length])), varying: records.filter(r => r.rarityVaries).map(r => [r.edition, r.name]) }, null, 2));

/** Preserve generated originals; create 2/3 masters and small map derivatives directly from each original. */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
if (process.argv.length !== 4) throw new Error("Usage: node prepare.ts <local-inputs.json> <preview.png>");
const script = String.raw`
from pathlib import Path
import hashlib, json, shutil, sys
from PIL import Image, ImageDraw
root, inputs, preview = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
originals, public = root/'assets/seabed-relief-originals', root/'public/assets/seabed-relief'
public.mkdir(parents=True, exist_ok=True)
preview.parent.mkdir(parents=True, exist_ok=True)
manifest, qa, prompts = {}, [], []
sheet = Image.new('RGB', (1200, 960), '#263d46')
draw = ImageDraw.Draw(sheet)
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
for n, row in enumerate(json.loads(inputs.read_text(encoding='utf-8'))):
    name, source = row['id'], Path(row['path'])
    target = originals/(name+'.png')
    if target.exists() and sha(target) != sha(source): raise ValueError('Refusing to replace original '+name)
    if not target.exists(): shutil.copyfile(source, target)
    image = Image.open(target)
    if image.mode != 'RGBA' or image.getchannel('A').getextrema()[0] != 0 or image.getchannel('A').getextrema()[1] < 240: raise ValueError('Real alpha required: '+name)
    w,h = image.size
    master = image.resize((round(w*2/3),round(h*2/3)), Image.Resampling.LANCZOS)
    master_path = public/(name+'.png')
    master.save(master_path, optimize=True)
    thumb = image.copy()
    thumb.thumbnail((128,128), Image.Resampling.LANCZOS)
    map_path = public/(name+'-map.png')
    thumb.save(map_path, optimize=True)
    manifest[name] = dict(kind=row['kind'],file=master_path.name,width=master.width,height=master.height,
      sha256=sha(master_path),mapFile=map_path.name,mapWidth=thumb.width,mapHeight=thumb.height,mapSha256=sha(map_path),
      originalWidth=w,originalHeight=h,originalSha256=sha(target))
    alpha = image.getchannel('A')
    qa.append(dict(id=name, transparentFraction=round(alpha.histogram()[0]/(w*h),4),solidBBox=alpha.point(lambda a:255 if a>64 else 0).getbbox()))
    prompts.append(dict(id=name,kind=row['kind'],prompt=row['prompt']))
    x,y=(n%4)*300,(n//4)*240
    draw.text((x+14,y+10),str(row['kind'])+' / '+name,fill='#ffffff')
    tile = image.copy()
    tile.thumbnail((272,195),Image.Resampling.LANCZOS)
    sheet.paste(tile,(x+(300-tile.width)//2,y+35+(195-tile.height)//2),tile)
(root/'src/data/seabed-relief-images.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
(originals/'qa.json').write_text(json.dumps(qa,indent=2)+'\n',encoding='utf-8')
(originals/'generation-spec.json').write_text(json.dumps(dict(tool='built-in image_gen',assets=prompts),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
sheet.save(preview)
print(json.dumps(dict(count=len(manifest),preview=str(preview),mapBytes=sum((public/m['mapFile']).stat().st_size for m in manifest.values()))))
`;
const result = spawnSync("python", ["-c", script, root, process.argv[2], process.argv[3]], { encoding: "utf8" });
if (result.status !== 0) throw new Error(result.stderr || result.stdout);
process.stdout.write(result.stdout);

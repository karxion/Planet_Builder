import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

// Produce a separate delivery directory; never overwrite generation originals or resize in place.
const [sourceArg, manifestArg, outputArg] = process.argv.slice(2);
if (!sourceArg || !manifestArg || !outputArg) throw new Error("Usage: node scripts/prepare-scene-delivery.ts <source-dir> <source-manifest> <new-output-dir>");
const source = resolve(sourceArg), output = resolve(outputArg);
if (source === output || existsSync(output)) throw new Error("Use a new output directory separate from the source");
const manifest = JSON.parse(readFileSync(resolve(manifestArg), "utf8"));
const files = Object.entries(manifest).map(([id, meta]) => {
  if (!/^[a-z]+$/.test(id)) throw new Error("Invalid module ID");
  const info = meta as {width:number;height:number;sha256:string;battleInset:number;originalWidth?:number};
  if (info.originalWidth !== undefined) throw new Error("This manifest is already resized; use the original source manifest");
  const bytes = readFileSync(join(source, `${id}.png`));
  if (createHash("sha256").update(bytes).digest("hex") !== info.sha256) throw new Error(`Source checksum mismatch: ${id}`);
  return {id,info,bytes};
});
mkdirSync(output, {recursive:true});
const browser = await chromium.launch({executablePath: process.env.SCENE_CHROMIUM_PATH || "/usr/bin/chromium",args:["--no-sandbox"]});
try {
  const page = await browser.newPage();
  const result: Record<string,unknown> = {};
  for (const {id,info,bytes} of files) {
    // Even width keeps the two view panels exactly bisected.
    const width = Math.max(2,Math.round(info.width/3)*2), height = Math.max(1,Math.round(info.height*2/3));
    const encoded = await page.evaluate(async ({input,width,height}) => {
      const image = new Image();
      await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error("PNG decode failed"));image.src=`data:image/png;base64,${input}`;});
      const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
      const context=canvas.getContext("2d");if(!context)throw new Error("Canvas unavailable");
      context.imageSmoothingEnabled=true;context.imageSmoothingQuality="high";
      context.drawImage(image,0,0,width,height);
      return canvas.toDataURL("image/png").split(",")[1];
    }, {input:bytes.toString("base64"),width,height});
    const png = Buffer.from(encoded,"base64");
    writeFileSync(join(output,`${id}.png`),png);
    result[id]={width,height,sha256:createHash("sha256").update(png).digest("hex"),battleInset:Math.round(info.battleInset*width/info.width),originalWidth:info.width,originalHeight:info.height,originalSha256:info.sha256};
    console.log(`${id}: ${info.width}x${info.height} -> ${width}x${height}`);
  }
  writeFileSync(join(output,"manifest.json"),JSON.stringify(result,null,2)+"\n");
} finally {await browser.close();}

"""Copy immutable generated originals and prepare the user-requested 2/3 PNGs."""
from pathlib import Path
import hashlib, json, shutil, sys
from PIL import Image

root = Path(__file__).resolve().parents[2]
originals = root / 'assets/subsurface-originals'
public = root / 'public/assets/subsurface'
public.mkdir(parents=True, exist_ok=True)
manifest_path = root / 'src/data/subsurface-image-manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
if len(sys.argv) != 2:
    raise SystemExit('Usage: python assets/subsurface-originals/prepare.py <local-generation-paths.json>')
inputs = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
sha = lambda path: hashlib.sha256(path.read_bytes()).hexdigest()
checks = []
for asset in inputs:
    key = asset['id'].lower()
    source = Path(asset['path'])
    original = originals / (key + '.png')
    if original.exists() and sha(original) != sha(source):
        raise ValueError('Refusing to replace a different original: ' + key)
    if not original.exists(): shutil.copyfile(source, original)
    with Image.open(original) as image:
        if image.mode != 'RGBA' or image.getchannel('A').getextrema() != (0, 255):
            raise ValueError('Real alpha transparency required: ' + key)
        w, h = image.size
        size = (max(2, round(w / 3) * 2), max(1, round(h * 2 / 3)))
        out = public / (key + '.png')
        image.resize(size, Image.Resampling.LANCZOS).save(out, optimize=True)
        alpha = image.getchannel('A')
        hist = alpha.histogram()
        solid = alpha.point(lambda a: 255 if a > 64 else 0)
        left, right = solid.crop((0,0,w//2,h)), solid.crop((w//2,0,w,h))
        if left.getbbox() is None or right.getbbox() is None:
            raise ValueError('Both camera halves must contain a visible object: ' + key)
        checks.append({'id': key, 'original': [w,h], 'deployed': list(size), 'transparentFraction': round(hist[0] / (w*h), 4), 'leftSolidBBox': left.getbbox(), 'rightSolidBBox': right.getbbox()})
        manifest[key] = {k: asset[k] for k in ['ko','en','space']}
        manifest[key].update(file=key+'.png', width=size[0], height=size[1], sha256=sha(out), originalWidth=w, originalHeight=h, originalSha256=sha(original), battleInset=0)
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
(originals / 'qa.json').write_text(json.dumps(checks, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(json.dumps({'prepared': len(checks), 'ids':[c['id'] for c in checks]}, ensure_ascii=False))

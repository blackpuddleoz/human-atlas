const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {withSupplementalMuscles}=require('../app/supplemental-muscles.ts');
const {getMuscleAttachment,normalizeMuscleName}=require('../app/muscle-attachments.ts');
const {getMuscleTeaching}=require('../app/muscle-teaching.ts');
const atlas=withSupplementalMuscles(require('../public/models/atlas.json'));
const parts=atlas.parts.filter(p=>p.system==='muscular');
const unique=new Set();
for(const part of parts){
 const key=normalizeMuscleName(part.name);unique.add(key);
 const entry=getMuscleAttachment(part.name);assert.ok(entry,part.name);
 for(const field of ['origin','insertion','action','description','note','observation']){
  assert.ok(typeof entry[field]==='string'&&entry[field].trim().length>=(['description','note'].includes(field)?40:2),`${part.name}: ${field}`);
  assert.ok(!/undefined|null|TODO|내용 추가 예정|주요 작용:/.test(entry[field]),`${part.name}: placeholder`);
 }
 assert.ok(getMuscleTeaching(key),`${part.name}: authored explanation missing`);
 assert.equal(entry.note,entry.description);
}
for(const key of unique){
 assert.deepEqual(getMuscleAttachment('Left '+key),getMuscleAttachment('Right '+key));
}
const long=getMuscleAttachment('Long head of right biceps brachii');
const short=getMuscleAttachment('Short head of left biceps brachii');
assert.notEqual(long.origin,short.origin);assert.notEqual(long.description,short.description);
assert.match(getMuscleAttachment('Right brachioradialis').description,/손목을 지나지/);
assert.match(getMuscleAttachment('inferior rectus').action,/외회선/);
assert.match(getMuscleAttachment('superior rectus').action,/내회선/);
console.log(`Verified ${parts.length} muscular meshes / ${unique.size} normalized muscles: origin, insertion, action, authored description, observation, bilateral lookup and named-head specificity.`);

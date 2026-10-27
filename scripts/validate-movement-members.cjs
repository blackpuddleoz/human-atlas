const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,filename);
const {movementMemberLabel,matchesMovementMember}=require('../app/movement-members.ts');
const {withSupplementalMuscles}=require('../app/supplemental-muscles.ts');
const {getKoreanName}=require('../app/korean-anatomy.ts');
const groups=require('../app/movement-groups.json');
const original=require('../public/models/atlas.json');
const atlas=withSupplementalMuscles(original);
for(const [title,label,english,excluded] of [
 ['견갑골 거상근','상부 승모근','descending part','ascending part'],
 ['견갑골 하강근','하부 승모근','ascending part','descending part'],
 ['견갑골 후인근','중부 승모근','transverse part','ascending part']
]){
 const member=groups.find(g=>g.title===title).members.find(m=>m.name==='승모근');
 assert.equal(movementMemberLabel(member),label);
 const selected=atlas.parts.filter(p=>matchesMovementMember(p.name,getKoreanName(p.name),member));
 assert.ok(selected.some(p=>p.name.toLowerCase().includes(english)));
 assert.ok(!selected.some(p=>new RegExp(`${excluded}|deltoid`).test(p.name.toLowerCase())));
 assert.equal(movementMemberLabel({...member,label:'삼각근'}),label);
}
for(const group of groups)for(const member of group.members){
 assert.ok(movementMemberLabel(member).replace(/\s/g,'').includes(member.name.replace(/\s/g,'')),`${group.title}: ${member.name}`);
}
for(const side of ['Left','Right']){
 const tfl=atlas.parts.find(p=>p.name===`${side} tensor fasciae latae`);
 const band=atlas.parts.find(p=>p.name===`${side} iliotibial tract`);
 assert.equal(tfl.system,'muscular');assert.equal(band.system,'connective');
 assert.equal(original.parts.find(p=>p.id===band.id).system,'connective');
 assert.equal(original.parts.find(p=>p.id===tfl.id).system,'muscular');
 assert.deepEqual(tfl.bounds,original.parts.find(p=>p.id===tfl.id).bounds);
 assert.ok(tfl.bounds[0][1]>band.bounds[0][1]);
 const member=groups.find(g=>g.title==='고관절 외전근').members.find(m=>m.name==='대퇴근막장근');
 assert.ok(matchesMovementMember(tfl.name,getKoreanName(tfl.name),member));
 assert.ok(!matchesMovementMember(band.name,getKoreanName(band.name),member));
}
console.log(`Validated ${groups.length} movement groups: canonical labels, trapezius subdivisions, bilateral TFL meshes and separate IT bands.`);
const {movementMemberColor,movementSelectionColors,MOVEMENT_COLORS}=require('../app/movement-members.ts');
for(const group of groups){
 assert.ok(group.members.length<=MOVEMENT_COLORS.length);
 const members=group.members.map((member,i)=>({color:movementMemberColor(i),ids:atlas.parts.filter(p=>p.system==='muscular'&&matchesMovementMember(p.name,getKoreanName(p.name),member)).map(p=>p.id)}));
 assert.equal(new Set(members.map(m=>m.color)).size,members.length,group.title);
 const colors=movementSelectionColors(members);
 for(const member of members)for(const id of member.ids){
  const first=members.find(m=>m.ids.includes(id));
  assert.equal(colors[id],first.color);
 }
}
assert.deepEqual(movementSelectionColors([]),{});
assert.deepEqual(movementSelectionColors([{ids:['left','right'],color:'#E87832'}]),{left:'#E87832',right:'#E87832'});
console.log('Validated unique member colors in all 43 movement groups, bilateral consistency, shared mesh precedence, and cleared palettes.');
const {getMuscleAttachment}=require('../app/muscle-attachments.ts');
for(const group of groups){
 for(const member of group.members){
  const selected=atlas.parts.filter(p=>(p.system==='muscular'||getMuscleAttachment(p.name))&&matchesMovementMember(p.name,getKoreanName(p.name),member,group.category));
  assert.ok(selected.length,`${group.title}: missing ${member.name}`);
  if(group.category==='upper')assert.ok(selected.every(p=>!getMuscleAttachment(p.name)?.originBones.some(b=>/fibula|tibia|femur|calcaneus|metatarsal/.test(b))),`${group.title}: lower limb leaked into ${member.name}`);
  if(group.category==='lower')assert.ok(selected.every(p=>!getMuscleAttachment(p.name)?.originBones.some(b=>/humerus|radius|ulna|carpal/.test(b))),`${group.title}: upper limb leaked into ${member.name}`);
 }
}
for(const [title,name,required,forbidden] of [
 ['손가락 굴곡근','장무지굴근','flexor pollicis longus','flexor hallucis longus'],
 ['손가락 신전근','장무지신근','extensor pollicis longus','extensor hallucis longus'],
 ['발목 배측굴곡근','장무지신근','extensor hallucis longus','extensor pollicis longus'],
 ['손가락 신전근','지신근','extensor digitorum','extensor digitorum longus'],
 ['주관절 굴곡근','상완근','brachialis','coracobrachialis']
]){
 const group=groups.find(g=>g.title===title),member=group.members.find(m=>m.name===name);
 assert.ok(matchesMovementMember('Right '+required,getKoreanName('Right '+required),member,group.category),title);
 assert.ok(!matchesMovementMember('Right '+forbidden,getKoreanName('Right '+forbidden),member,group.category),title);
}
assert.match(getKoreanName('Right flexor pollicis longus'),/\(손\)/);
assert.match(getKoreanName('Right flexor hallucis longus'),/\(발\)/);
console.log('Validated all 43 movement groups against hand/foot cross-matching and unrelated partial-name matches.');

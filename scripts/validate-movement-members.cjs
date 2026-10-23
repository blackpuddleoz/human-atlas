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

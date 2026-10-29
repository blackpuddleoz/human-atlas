const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,f);
const {withSupplementalMuscles,SUPPLEMENTAL_NAMES,SUPPLEMENTAL_SOURCE}=require('../app/supplemental-muscles.ts');
const {getKoreanName,findAnatomyConcepts}=require('../app/korean-anatomy.ts');
const atlas=withSupplementalMuscles(require('../public/models/atlas.json'));
for(const query of ['요방형근','허리네모근','왼쪽 요방형근','좌측 허리네모근']){
 const results=findAnatomyConcepts(atlas,query);assert.ok(results.some(c=>c.name==='Left quadratus lumborum'),query);
 if(!/왼쪽|좌측/.test(query))assert.ok(results.some(c=>c.name==='Right quadratus lumborum'),query);
}
assert.equal(getKoreanName('Left quadratus lumborum'),'왼쪽 요방형근');
assert.equal(getKoreanName('Right quadratus lumborum'),'오른쪽 요방형근');
assert.equal(SUPPLEMENTAL_SOURCE,'/models/supplemental.gltf');
const g=JSON.parse(fs.readFileSync('public'+SUPPLEMENTAL_SOURCE));
const bin=Buffer.from(g.buffers[0].uri.split(',')[1],'base64');assert.equal(bin.length,g.buffers[0].byteLength);
for(const name of SUPPLEMENTAL_NAMES){
 const node=g.nodes.find(n=>n.extras.name===name);assert.ok(node,name);
 const p=g.meshes[node.mesh].primitives[0],a=g.accessors[p.attributes.POSITION];
 assert.ok(a.count>20,name+' vertices');assert.ok(g.accessors[p.indices].count>60,name+' triangles');
 for(let k=0;k<3;k++)assert.ok(a.max[k]>a.min[k],name+' nonempty bounds');
}
console.log('Verified bilateral Korean search, aliases, labels and 14 self-contained supplemental meshes.');
(async()=>{
 globalThis.ProgressEvent=class{constructor(type,init){Object.assign(this,init);this.type=type;}};
 const T=await import('three');const {GLTFLoader}=await import('three/examples/jsm/loaders/GLTFLoader.js');
 const gltf=await new GLTFLoader().parseAsync(JSON.stringify(g),'');gltf.scene.updateMatrixWorld(true);
 let count=0;gltf.scene.traverse(o=>{if(o instanceof T.Mesh&&/quadratus lumborum/i.test(o.userData.name)){
  const {bakeSupplementalGeometry}=require('../app/supplemental-geometry.ts');
  const baked=bakeSupplementalGeometry(o.geometry,o.matrixWorld);
  const box=baked.boundingBox,size=box.getSize(new T.Vector3());
  assert.ok(baked.attributes.position.array instanceof Float32Array);
  assert.ok(size.x>.02&&size.z>.01,'Integer geometry did not collapse during transform');
  assert.ok(size.y>.1&&size.y<.4,'Preserved quantized unit scale');
  assert.ok(box.min.y>.8&&box.max.y<1.3,'Lumbar location in atlas meters');count++;
 }});assert.equal(count,2);console.log('Three.js loaded both quadratus lumborum meshes with lumbar bounds and correct unit scale.');
})().catch(e=>{console.error(e);process.exitCode=1;});

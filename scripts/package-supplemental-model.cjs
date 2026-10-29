// Extract audited Écorché meshes and registration bones without changing shape.
// Source: Charleeh/ecorche, CC BY-SA 4.0. Run with the downloaded ecorche.glb.
const fs=require('node:fs');
const b=fs.readFileSync(process.argv[2]);
const jsonSize=b.readUInt32LE(12),g=JSON.parse(b.subarray(20,20+jsonSize));
const bin=b.subarray(28+jsonSize);
const names=[...fs.readFileSync('app/supplemental-muscles.ts','utf8').matchAll(/^  "([^"]+)"/gm)].map(m=>m[1]);
names.push('Left femur','Right femur','Body of sternum','Left humerus','Right humerus');
const out={asset:{version:'2.0',copyright:'Charleeh/ecorche; BodyParts3D and Z-Anatomy; CC BY-SA 4.0. See supplemental-model-LICENSE.md'},scene:0,scenes:[{nodes:[]}],nodes:[],meshes:[],accessors:[],bufferViews:[],buffers:[],extensionsUsed:g.extensionsUsed,extensionsRequired:g.extensionsRequired};
const chunks=[],views=new Map(),accessors=new Map();let offset=0;
function accessor(i){if(accessors.has(i))return accessors.get(i);const a={...g.accessors[i]},v=a.bufferView;
 if(!views.has(v)){const src=g.bufferViews[v];const bytes=bin.subarray(src.byteOffset||0,(src.byteOffset||0)+src.byteLength);views.set(v,out.bufferViews.length);out.bufferViews.push({...src,buffer:0,byteOffset:offset});chunks.push(bytes);offset+=bytes.length;const pad=(4-offset%4)%4;if(pad){chunks.push(Buffer.alloc(pad));offset+=pad;}}
 a.bufferView=views.get(v);const index=out.accessors.length;out.accessors.push(a);accessors.set(i,index);return index;}
const nodeMap=new Map();
for(const [originalIndex,n] of g.nodes.entries()){if(!names.includes(n.extras?.name||n.name))continue;
 const mesh=g.meshes[n.mesh];const primitives=mesh.primitives.map(p=>({attributes:Object.fromEntries(Object.entries(p.attributes).filter(([k])=>k==='POSITION'||k==='NORMAL').map(([k,v])=>[k,accessor(v)])),indices:accessor(p.indices)}));
 nodeMap.set(originalIndex,out.nodes.length);out.nodes.push({...n,mesh:out.meshes.length});out.meshes.push({name:mesh.name,primitives});}
if(out.nodes.length!==names.length)throw Error('Missing supplemental mesh');
// Preserve every ancestor transform, including quantized model unit scale.
function keepNode(i){if(nodeMap.has(i))return nodeMap.get(i);const node=g.nodes[i],children=(node.children||[]).map(keepNode).filter(i=>i!==null);if(!children.length)return null;const index=out.nodes.length;out.nodes.push({...node,children});nodeMap.set(i,index);return index;}
out.scenes[0].nodes=g.scenes[g.scene||0].nodes.map(keepNode).filter(i=>i!==null);
out.buffers=[{byteLength:offset,uri:'data:application/octet-stream;base64,'+Buffer.concat(chunks).toString('base64')}];
fs.writeFileSync('public/models/supplemental.gltf',JSON.stringify(out));
console.log(`Packaged ${out.meshes.length} meshes, ${offset} geometry bytes`);

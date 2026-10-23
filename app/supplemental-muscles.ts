import type {Atlas,Part} from './anatomy';
/** Audited Ecorche supplemental meshes absent from BodyParts3D atlas.
 * Mesh binary: Charleeh/ecorche (CC BY-SA 4.0); sourced at runtime,
 * requires shape registration against existing BodyParts3D skeleton. */
export const SUPPLEMENTAL_SOURCE='https://raw.githubusercontent.com/Charleeh/ecorche/main/model/ecorche.glb';
export const SUPPLEMENTAL_FALLBACK='https://cdn.jsdelivr.net/gh/Charleeh/ecorche@main/model/ecorche.glb';
export const SUPPLEMENTAL_NAMES=[
  "Left internal oblique",
  "Left multifidus cervicis",
  "Left multifidus lumborum",
  "Left multifidus thoracis",
  "Left quadratus lumborum",
  "Right internal oblique",
  "Right multifidus cervicis",
  "Right multifidus lumborum",
  "Right multifidus thoracis",
  "Right quadratus lumborum",
  "Left latissimus dorsi",
  "Left rectus abdominis",
  "Right latissimus dorsi",
  "Right rectus abdominis"
] as const;
export const SUPPLEMENTAL_IDS=new Map<string,string>(SUPPLEMENTAL_NAMES.map((name,i)=>[name.toLowerCase(),'ecorche-'+i]));
export function withSupplementalMuscles(atlas:Atlas):Atlas{
 const correctedParts=atlas.parts.map(p=>(p.system==='skeletal'||p.system==='connective')&&/^(left|right) (levator scapulae|subscapularis|tensor fasciae latae|tibialis anterior|tibialis posterior|fibularis (longus|brevis|tertius))$/i.test(p.name)?{...p,system:'muscular' as const}:p);
 const existing=new Set(correctedParts.map(p=>p.name.toLowerCase()));
 const additions:Part[]=SUPPLEMENTAL_NAMES.filter(name=>!existing.has(name.toLowerCase())).map(name=>({
  id:SUPPLEMENTAL_IDS.get(name.toLowerCase())!,name,conceptId:'supp-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),system:'muscular',chunk:-1,
  positions:0,normals:0,indices:0,vertexCount:0,indexCount:0,bounds:[[0,.7,0],[0,.8,0]]
 }));
 return {...atlas,parts:[...correctedParts,...additions],concepts:[...atlas.concepts,...additions.map(p=>({id:p.conceptId,name:p.name,elements:[p.id]}))]};
}

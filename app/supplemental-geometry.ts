import * as T from 'three';

/** Quantized integer coordinates must become floats before applying unit scale.
 * Applying a 0.0001 scale directly to Int16 positions rounds the mesh to 0/1. */
export function bakeSupplementalGeometry(source:T.BufferGeometry,world:T.Matrix4):T.BufferGeometry{
 const geometry=source.clone();
 for(const key of ['position','normal']){
  const attribute=geometry.getAttribute(key);if(!attribute)continue;
  const values=new Float32Array(attribute.count*3);
  for(let i=0;i<attribute.count;i++)values.set([attribute.getX(i),attribute.getY(i),attribute.getZ(i)],i*3);
  geometry.setAttribute(key,new T.BufferAttribute(values,3));
 }
 geometry.applyMatrix4(world);geometry.computeBoundingBox();geometry.computeBoundingSphere();
 return geometry;
}

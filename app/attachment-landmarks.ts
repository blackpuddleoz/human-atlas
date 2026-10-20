import type {Atlas} from './anatomy';

/** Model-space landmarks are deliberately separate from textual anatomy.
 * No landmark is displayed unless its model-specific coordinates and source
 * have been reviewed. Values are in the coordinate system of atlas.json.
 */
export interface AttachmentLandmark {
 muscle:string;
 side:'left'|'right';
 kind:'origin'|'insertion';
 label:string;
 bonePartId:string;
 position:[number,number,number];
 source:string;
 reviewedBy:string;
 reviewedAt:string;
 status:'coordinate-verified';
}
/** Empty until a reviewer validates exact BodyParts3D mesh coordinates. */
export const VERIFIED_LANDMARKS:AttachmentLandmark[]=[];

export function getValidatedLandmarks(atlas:Atlas, selectedNames:string[]):AttachmentLandmark[]{
 const parts=new Map(atlas.parts.map(part=>[part.id,part]));
 return VERIFIED_LANDMARKS.filter(landmark=>{
  if(!selectedNames.some(name=>name.toLowerCase().includes(landmark.muscle.toLowerCase())))return false;
  const part=parts.get(landmark.bonePartId);
  if(!part||part.system!=='skeletal'||!landmark.source.trim()||!landmark.reviewedBy.trim()||!landmark.reviewedAt.trim())return false;
  const [lo,hi]=part.bounds;
  return landmark.position.every((v,i)=>Number.isFinite(v)&&v>=lo[i]&&v<=hi[i]);
 });
}

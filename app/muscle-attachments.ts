/** Curated introductory muscle attachment descriptions.
 * Bone highlights indicate the attachment-bearing bone, not a precise enthesis.
 */
export interface MuscleAttachment {
 origin:string; insertion:string; action:string; originBones:string[]; insertionBones:string[];
}
const DATA:Record<string,MuscleAttachment>={
 'zone of deltoid':{origin:'쇄골 가쪽 1/3, 견봉, 견갑극',insertion:'상완골 삼각근조면',action:'어깨관절 벌림. 앞섬유는 굴곡·안쪽돌림, 뒤섬유는 신전·가쪽돌림에 기여',originBones:['clavicle','scapula'],insertionBones:['humerus']},
 'serratus anterior':{origin:'제1~8(또는 9)늑골의 바깥면',insertion:'견갑골 안쪽모서리의 앞면(특히 아래각)',action:'견갑골 전인·상방회전, 흉곽에 견갑골 고정',originBones:['rib'],insertionBones:['scapula']},
 'psoas major':{origin:'대체로 제12흉추~제5요추의 척추체·추간판 및 요추 횡돌기',insertion:'대퇴골 작은돌기(장골근과 함께)',action:'고관절 굴곡, 요추와 골반의 안정화에 기여',originBones:['lumbar vertebra','twelfth thoracic vertebra'],insertionBones:['femur']},
 'gluteus maximus':{origin:'장골 뒤쪽, 천골·미골 뒤쪽 및 천결절인대',insertion:'장경인대 및 대퇴골 둔근조면',action:'고관절 신전·가쪽돌림, 일어서기와 계단 오르기에서 힘 생성',originBones:['hip bone','ilium','sacrum','coccyx'],insertionBones:['femur']},
 'rectus femoris':{origin:'전하장골극 및 비구 위쪽의 장골',insertion:'슬개골을 거쳐 슬개인대로 경골조면',action:'무릎관절 폄과 고관절 굴곡',originBones:['hip bone','ilium'],insertionBones:['patella','tibia']},
 'clavicular part of deltoid':{origin:'쇄골 가쪽 1/3',insertion:'상완골 삼각근조면',action:'어깨관절 굴곡·안쪽돌림 및 수평모음에 기여',originBones:['clavicle'],insertionBones:['humerus']},
 'acromial part of deltoid':{origin:'견봉',insertion:'상완골 삼각근조면',action:'어깨관절 벌림',originBones:['scapula'],insertionBones:['humerus']},
 'spinal part of deltoid':{origin:'견갑극',insertion:'상완골 삼각근조면',action:'어깨관절 신전·가쪽돌림 및 수평벌림에 기여',originBones:['scapula'],insertionBones:['humerus']},
};
export function getMuscleAttachment(name:string):MuscleAttachment|null{
 const key=name.toLowerCase().replace(/^(left|right) /,'').trim();
 return DATA[key]??null;
}

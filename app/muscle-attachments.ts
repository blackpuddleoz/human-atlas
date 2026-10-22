/** Curated introductory muscle attachment descriptions.
 * Bone highlights indicate the attachment-bearing bone, not a precise enthesis.
 */
export interface MuscleAttachment {
 origin:string; insertion:string; action:string; yoga?:string; originBones:string[]; insertionBones:string[]; sites?:{kind:'origin'|'insertion';label:string;bone:string;status:'text-verified'|'coordinate-verified'}[];
}
const DATA:Record<string,MuscleAttachment>={
 'supraspinatus':{"origin":"견갑골 극상와","insertion":"상완골 대결절 위쪽면","action":"어깨관절 벌림 시작과 상완골두 안정화","originBones":["scapula"],"insertionBones":["humerus"],"yoga":"팔을 들어 올릴 때 회전근개가 상완골두를 안정화하는 역할을 관찰합니다."},
 'infraspinatus':{"origin":"견갑골 극하와","insertion":"상완골 대결절 중간면","action":"어깨관절 가쪽돌림과 상완골두 안정화","originBones":["scapula"],"insertionBones":["humerus"],"yoga":"팔을 뒤로 돌리는 동작에서 견갑골의 움직임과 상완골의 회전을 구분합니다."},
 'subscapularis':{"origin":"견갑골 견갑하와","insertion":"상완골 소결절","action":"어깨관절 안쪽돌림과 상완골두 안정화","originBones":["scapula"],"insertionBones":["humerus"],"yoga":"팔을 머리 위로 올릴 때 안쪽돌림과 견갑골 상방회전을 구분해 관찰합니다."},
 'teres minor':{"origin":"견갑골 가쪽모서리 위쪽 부위","insertion":"상완골 대결절 아래쪽면","action":"어깨관절 가쪽돌림과 안정화","originBones":["scapula"],"insertionBones":["humerus"],"yoga":"팔의 가쪽돌림을 관찰할 때 견갑골 움직임과 혼동하지 않습니다."},
 'teres major':{"origin":"견갑골 아래각의 뒤쪽","insertion":"상완골 결절간구 안쪽입술","action":"어깨관절 모음·신전·안쪽돌림","originBones":["scapula"],"insertionBones":["humerus"],"yoga":"팔을 머리 위로 뻗는 자세에서 어깨 굴곡 범위와의 관계를 관찰합니다."},
 'pectoralis minor':{"origin":"제3~5늑골 앞면","insertion":"견갑골 오훼돌기","action":"견갑골 전인·하방회전 및 흉곽에 대한 견갑골 안정화","originBones":["rib"],"insertionBones":["scapula"],"yoga":"팔을 위로 올릴 때 견갑골의 움직임을 제한하는 요인이 있는지 살펴봅니다."},
 'rhomboid major':{"origin":"제2~5흉추 극돌기","insertion":"견갑골 안쪽모서리(견갑극 아래)","action":"견갑골 후인·하방회전·안정화","originBones":["thoracic vertebra"],"insertionBones":["scapula"],"yoga":"팔을 지지하는 자세에서 견갑골을 무조건 모으기보다 흉곽 위 움직임을 관찰합니다."},
 'rhomboid minor':{"origin":"제7경추~제1흉추 극돌기","insertion":"견갑골 안쪽모서리의 견갑극 높이","action":"견갑골 후인·하방회전·안정화","originBones":["cervical vertebra","thoracic vertebra"],"insertionBones":["scapula"],"yoga":"견갑골의 후인과 상방회전이 다른 움직임임을 구분합니다."},
 'levator scapulae':{"origin":"제1~4경추 횡돌기 뒤결절","insertion":"견갑골 위각 및 안쪽모서리 위쪽","action":"견갑골 거상·하방회전, 견갑골 고정 시 목 움직임에 관여","originBones":["cervical vertebra"],"insertionBones":["scapula"],"yoga":"어깨를 올리는 보상과 경추의 움직임을 함께 관찰합니다."},
 'iliacus':{"origin":"장골와","insertion":"대요근과 함께 대퇴골 작은돌기 및 인접 부위","action":"고관절 굴곡","originBones":["hip bone"],"insertionBones":["femur"],"yoga":"다리를 들어 올릴 때 고관절 굴곡과 요추 굴곡을 구분합니다."},
 'gluteus medius':{"origin":"장골 바깥면(앞볼기근선과 뒤볼기근선 사이)","insertion":"대퇴골 대전자 가쪽면","action":"고관절 벌림·골반 수평 유지, 앞뒤 섬유에 따른 회전 보조","originBones":["hip bone"],"insertionBones":["femur"],"yoga":"우티타 하스타 파당구쉬타아사나에서 지지 다리의 골반 안정성을 관찰합니다."},
 'gluteus minimus':{"origin":"장골 바깥면(앞볼기근선과 아래볼기근선 사이)","insertion":"대퇴골 대전자 앞면","action":"고관절 벌림·안쪽돌림 및 골반 안정화","originBones":["hip bone"],"insertionBones":["femur"],"yoga":"한 발 서기에서 골반의 측방 기울어짐을 관찰합니다."},
 'piriformis':{"origin":"천골 앞면","insertion":"대퇴골 대전자 위쪽모서리","action":"고관절 폄 위치에서 가쪽돌림, 굴곡 위치에서 벌림에 기여","originBones":["sacrum"],"insertionBones":["femur"],"yoga":"고관절 굴곡 각도에 따라 근육의 작용선이 달라질 수 있음을 설명합니다."},
 'rectus abdominis':{"origin":"치골결합 및 치골능선","insertion":"제5~7늑연골과 검상돌기","action":"몸통 굴곡·복압 조절·골반 후방경사에 기여","originBones":["hip bone"],"insertionBones":["sternum","rib"],"yoga":"후굴에서 복부의 길이 변화와 몸통 안정화의 관계를 관찰합니다."},
 'external oblique':{"origin":"제5~12늑골 바깥면","insertion":"백선·치골결절·장골능선 앞쪽","action":"몸통 굴곡·반대쪽 회전·복압 조절","originBones":["rib"],"insertionBones":["hip bone"],"yoga":"비틀기에서 몸통 회전과 골반 회전을 구분합니다."},
 'sartorius':{"origin":"전상장골극","insertion":"경골 안쪽 위부분(거위발)","action":"고관절 굴곡·벌림·가쪽돌림 및 무릎 굴곡 보조","originBones":["hip bone"],"insertionBones":["tibia"],"yoga":"다리를 접는 자세에서 고관절 움직임과 무릎에 가해지는 힘을 구분합니다."},
 'vastus medialis':{"origin":"대퇴골 거친선 안쪽입술 등","insertion":"슬개골과 슬개인대를 거쳐 경골조면","action":"무릎 폄 및 슬개골의 움직임 조절에 기여","originBones":["femur"],"insertionBones":["patella","tibia"],"yoga":"무릎을 펴는 동작에서 슬개골의 경로와 통증 유무를 관찰합니다."},
 'vastus lateralis':{"origin":"대퇴골 대전자·둔근조면·거친선 가쪽입술 등","insertion":"슬개골과 슬개인대를 거쳐 경골조면","action":"무릎 폄","originBones":["femur"],"insertionBones":["patella","tibia"],"yoga":"선 자세에서 무릎을 펴는 힘과 고관절 움직임을 구분합니다."},
 'biceps femoris':{"origin":"긴갈래: 좌골결절, 짧은갈래: 대퇴골 거친선 가쪽입술 등","insertion":"비골두 및 경골 가쪽 부위","action":"무릎 굴곡·굽힌 무릎의 가쪽돌림; 긴갈래는 고관절 신전","originBones":["hip bone","femur"],"insertionBones":["fibula","tibia"],"yoga":"전굴에서 햄스트링 장력과 무릎의 움직임을 함께 관찰합니다."},
 'semitendinosus':{"origin":"좌골결절","insertion":"경골 안쪽 위부분(거위발)","action":"고관절 신전·무릎 굴곡·굽힌 무릎의 안쪽돌림","originBones":["hip bone"],"insertionBones":["tibia"],"yoga":"전굴에서 골반 전방경사와 무릎 굴곡의 상호작용을 관찰합니다."},
 'semimembranosus':{"origin":"좌골결절","insertion":"경골 안쪽관절융기 뒤쪽","action":"고관절 신전·무릎 굴곡·굽힌 무릎의 안쪽돌림","originBones":["hip bone"],"insertionBones":["tibia"],"yoga":"무릎을 완전히 펴는 과정에서 당김과 관절 통증을 구분합니다."},
 'gastrocnemius':{"origin":"대퇴골 안쪽·가쪽관절융기 부근","insertion":"아킬레스힘줄을 통해 종골 뒤쪽","action":"발목 발바닥굽힘 및 무릎 굴곡 보조","originBones":["femur"],"insertionBones":["calcaneus"],"yoga":"무릎을 편 상태와 굽힌 상태에서 발목 가동성 차이를 관찰합니다."},
 'soleus':{"origin":"비골두·비골 뒤면·경골 가자미근선 등","insertion":"아킬레스힘줄을 통해 종골 뒤쪽","action":"발목 발바닥굽힘과 서 있는 자세의 안정화","originBones":["tibia","fibula"],"insertionBones":["calcaneus"],"yoga":"무릎을 굽힌 발목 가동성 검사에서 비복근과의 차이를 관찰합니다."},
 'tibialis anterior':{"origin":"경골 가쪽관절융기·가쪽면 및 골간막","insertion":"안쪽쐐기뼈·제1중족골 바닥","action":"발목 발등굽힘·발 안쪽번짐","originBones":["tibia"],"insertionBones":["medial cuneiform","first metatarsal"],"yoga":"발을 들어 올릴 때 발목과 발가락 움직임을 구분합니다."},
 'latissimus dorsi':{"origin":"아래쪽 흉추 극돌기·흉요근막·장골능선 등","insertion":"상완골 결절간구 바닥","action":"어깨관절 신전·모음·안쪽돌림","originBones":["thoracic vertebra","hip bone"],"insertionBones":["humerus"],"yoga":"팔을 위로 뻗는 후굴에서 흉곽과 상완골의 움직임을 함께 관찰합니다."},

 'zone of deltoid':{origin:'쇄골 가쪽 1/3, 견봉, 견갑극',insertion:'상완골 삼각근조면',action:'어깨관절 벌림. 앞섬유는 굴곡·안쪽돌림, 뒤섬유는 신전·가쪽돌림에 기여',originBones:['clavicle','scapula'],insertionBones:['humerus'],sites:[{kind:'origin',label:'쇄골 가쪽 1/3 앞쪽 가장자리',bone:'쇄골',status:'text-verified'},{kind:'origin',label:'견봉 가쪽 가장자리',bone:'견갑골',status:'text-verified'},{kind:'origin',label:'견갑극 아래쪽 능선',bone:'견갑골',status:'text-verified'},{kind:'insertion',label:'상완골 삼각근조면',bone:'상완골',status:'text-verified'}]},
 'serratus anterior':{origin:'제1~8(또는 9)늑골의 바깥면',insertion:'견갑골 안쪽모서리의 앞면(특히 아래각)',action:'견갑골 전인·상방회전, 흉곽에 견갑골 고정',originBones:['rib'],insertionBones:['scapula']},
 'psoas major':{origin:'대체로 제12흉추~제5요추의 척추체·추간판 및 요추 횡돌기',insertion:'대퇴골 작은돌기(장골근과 함께)',action:'고관절 굴곡, 요추와 골반의 안정화에 기여',originBones:['lumbar vertebra','twelfth thoracic vertebra'],insertionBones:['femur']},
 'gluteus maximus':{origin:'장골 뒤쪽, 천골·미골 뒤쪽 및 천결절인대',insertion:'장경인대 및 대퇴골 둔근조면',action:'고관절 신전·가쪽돌림, 일어서기와 계단 오르기에서 힘 생성',originBones:['hip bone','ilium','sacrum','coccyx'],insertionBones:['femur']},
 'rectus femoris':{origin:'전하장골극 및 비구 위쪽의 장골',insertion:'슬개골을 거쳐 슬개인대로 경골조면',action:'무릎관절 폄과 고관절 굴곡',originBones:['hip bone','ilium'],insertionBones:['patella','tibia']},
 'clavicular part of deltoid':{origin:'쇄골 가쪽 1/3',insertion:'상완골 삼각근조면',action:'어깨관절 굴곡·안쪽돌림 및 수평모음에 기여',originBones:['clavicle'],insertionBones:['humerus'],sites:[{kind:'origin',label:'쇄골 가쪽 1/3 앞쪽 가장자리',bone:'쇄골',status:'text-verified'},{kind:'insertion',label:'상완골 삼각근조면',bone:'상완골',status:'text-verified'}]},
 'acromial part of deltoid':{origin:'견봉',insertion:'상완골 삼각근조면',action:'어깨관절 벌림',originBones:['scapula'],insertionBones:['humerus'],sites:[{kind:'origin',label:'견봉 가쪽 가장자리',bone:'견갑골',status:'text-verified'},{kind:'insertion',label:'상완골 삼각근조면',bone:'상완골',status:'text-verified'}]},
 'spinal part of deltoid':{origin:'견갑극',insertion:'상완골 삼각근조면',action:'어깨관절 신전·가쪽돌림 및 수평벌림에 기여',originBones:['scapula'],insertionBones:['humerus'],sites:[{kind:'origin',label:'견갑극 아래쪽 능선',bone:'견갑골',status:'text-verified'},{kind:'insertion',label:'상완골 삼각근조면',bone:'상완골',status:'text-verified'}]},
};
export function getMuscleAttachment(name:string):MuscleAttachment|null{
 const key=name.toLowerCase().trim().replace(/^(left|right) /,'').replace(/\b(left|right)\b /,'').replace(/^(.+?) of (left|right) (.+)$/,'$1 of $3');
 return DATA[key]??null;
}

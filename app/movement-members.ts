import {GROUP_ALIASES,MORE_GROUP_ALIASES} from './movement-aliases';
export const normalizeMovementName=(v:string)=>v.replace(/^(왼쪽|오른쪽|좌측|우측)\s*/,'').replace(/\s/g,'').replace(/근군$/,'근');
/** English identities take precedence over ambiguous Korean hand/foot names. */
export function getMovementAliases(name:string,category?:string):string[]{
 const target=normalizeMovementName(name);
 const lower:Record<string,string[]>={
  '장무지신근':['extensor hallucis longus'],'장무지굴근':['flexor hallucis longus'],
  '단무지신근':['extensor hallucis brevis'],'단무지굴근':['flexor hallucis brevis'],
  '무지외전근':['abductor hallucis'],'무지내전근':['adductor hallucis'],
  '소지외전근':['abductor digiti minimi of foot'],'소지굴근':['flexor digiti minimi brevis of foot'],
  '소지대립근':['opponens digiti minimi of foot'],'충양근':['lumbrical of foot']
 };
 return (category==='lower'?lower[target]:undefined)??GROUP_ALIASES[target]??MORE_GROUP_ALIASES[target]??[];
}
export function matchesMovementMember(english:string,korean:string,member:{name:string;label:string;qualifier?:string},category?:string):boolean{
 const target=normalizeMovementName(member.name);
 const ko=normalizeMovementName(korean);
 const en=english.toLowerCase().replace(/\b(left|right)\b/g,'').replace(/\s+/g,' ').trim();
 const aliases=getMovementAliases(member.name,category);
 const foot=/\b(hallucis|of foot|plantar|tibialis|fibularis|gastrocnemius|soleus|femoris|gluteus|iliacus|psoas|pectineus|sartorius|gracilis|vastus|popliteus|plantaris)\b/.test(en)||/extensor digitorum longus|flexor digitorum (longus|brevis)|tensor fasciae latae/.test(en);
 const hand=/\b(pollicis|carpi|of hand|brachii|brachialis|brachioradialis|pronator|supinator|anconeus)\b/.test(en);
 if(category==='upper'&&foot||category==='lower'&&hand)return false;
 const matching=aliases.length?aliases.some(a=>{
  if(a==='extensor digitorum')return en==='extensor digitorum'||en==='extensor digitorum muscle';
  const escaped=a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return new RegExp('(?:^| )'+escaped+'(?= |$)').test(en);
 }):target.length>=2&&ko.includes(target);
 if(!matching)return false;
 const qualifier=(member.qualifier||member.label||'').replace(/^[—\s]+/,'');
 if(/상부·하부/.test(qualifier))return !/transverse part|middle/.test(en);
 if(/상부|위섬유/.test(qualifier))return !/transverse part|ascending part|middle|lower/.test(en);
 if(/하부|아래섬유/.test(qualifier))return !/transverse part|descending part|middle|upper/.test(en);
 if(/중부|중간섬유/.test(qualifier))return !/ascending part|descending part|upper|lower/.test(en);
 if(/전부|앞섬유/.test(qualifier))return !/spinal part|posterior part|acromial part/.test(en);
 if(/후부|뒤섬유/.test(qualifier))return !/clavicular part|anterior part|acromial part/.test(en);
 if(/쇄골두/.test(qualifier))return !/sternocostal|abdominal part/.test(en);
 if(/흉골두/.test(qualifier))return !/clavicular|abdominal part/.test(en);
 if(/장두/.test(qualifier))return !/short head|lateral head|medial head/.test(en);
 if(/단두/.test(qualifier))return !/long head/.test(en);
 return true;
}

/** A curriculum label must retain the identity used for mesh selection. */
export function movementMemberLabel(member:{name:string;label:string;qualifier?:string}):string{
 const name=member.name.trim();
 const qualifier=(member.qualifier??'').trim();
 if(name==='승모근' && /^(상부|중부|하부)$/.test(qualifier))return `${qualifier} ${name}`;
 const label=member.label.replace(/^[—/\s]+/,'').trim();
 if(normalizeMovementName(label).includes(normalizeMovementName(name)))return label;
 return qualifier?`${name} (${qualifier})`:name;
}

// One shared key for the legend and every left/right mesh belonging to a member.
export const MOVEMENT_COLORS=['#E87832','#367DE5','#B452CC','#249C75','#DFB62E','#D84C6F','#4BB8CE','#8A9940'] as const;
export const movementMemberColor=(index:number):string=>MOVEMENT_COLORS[index % MOVEMENT_COLORS.length];
export function movementSelectionColors(members:ReadonlyArray<{ids:string[];color:string}>):Record<string,string>{
 const colors:Record<string,string>={};
 for(const member of members)for(const id of member.ids)colors[id]??=member.color;
 return colors;
}

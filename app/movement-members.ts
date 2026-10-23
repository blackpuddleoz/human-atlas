import {GROUP_ALIASES,MORE_GROUP_ALIASES} from './movement-aliases';
export const normalizeMovementName=(v:string)=>v.replace(/^(왼쪽|오른쪽|좌측|우측)\s*/,'').replace(/\s/g,'').replace(/근군$/,'근');
export function matchesMovementMember(english:string,korean:string,member:{name:string;label:string;qualifier?:string}):boolean{
 const target=normalizeMovementName(member.name);
 const ko=normalizeMovementName(korean);
 const en=english.toLowerCase().replace(/\b(left|right)\b/g,'').replace(/\s+/g,' ').trim();
 const aliases=GROUP_ALIASES[target]??MORE_GROUP_ALIASES[target]??[];
 const matching=aliases.some(a=>en.includes(a))||(target.length>=2&&ko.includes(target));
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

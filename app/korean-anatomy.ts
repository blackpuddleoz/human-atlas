import type { Atlas, Concept, SystemId } from './anatomy';
import glossary from './anatomy-ko.json';

type KoreanEntry = { ko: string; aliases: string[]; summary?: string };
const TERMS = glossary as Record<string, KoreanEntry>;
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().replace(/[\s()/_·.,-]/g, '');

export const KOREAN_SYSTEMS: Partial<Record<SystemId, string>> = {
  skeletal: '골격계',
  muscular: '근육계',
  cardiac:'심장',sensory:'감각기관',arterial:'동맥계',venous:'정맥계',nervous:'신경계',respiratory:'호흡계',digestive:'소화계',urinary:'비뇨계',lymphatic:'림프계',endocrine:'내분비계',reproductive:'생식계',integumentary:'외피계',connective:'결합조직',
};

export function koreanSystemName(system: SystemId, fallback: string): string {
  return KOREAN_SYSTEMS[system] ?? fallback;
}

function translatedEntry(name: string): KoreanEntry | null {
  const key = name.trim().toLocaleLowerCase();
  const direct = TERMS[key];
  if (direct) return direct;
  const prefix = key.match(/^(right|left) (.+)$/);
  const infix = key.match(/^(.+?) of (right|left) (.+)$/);
  const side = prefix?.[1] ?? infix?.[2];
  const base = prefix?.[2] ?? (infix ? `${infix[1]} of ${infix[3]}` : '');
  if (!side || !base) return null;
  const entry = TERMS[base];
  if (!entry) return null;
  const fullSide = side === 'right' ? '오른쪽' : '왼쪽';
  const clinicalSide = side === 'right' ? '우측' : '좌측';
  return {
    ko: `${fullSide} ${entry.ko}`,
    aliases: [
      `${clinicalSide} ${entry.ko}`,
      ...entry.aliases.flatMap(alias => [`${fullSide} ${alias}`, `${clinicalSide} ${alias}`]),
    ],
    summary: entry.summary,
  };
}


/** Model catalogue naming conventions (BodyParts3D): bilateral infixes and
 * numbered vertebrae, ribs, phalanges and teeth. */
const ORDINAL_NUMBER:Record<string,number>={first:1,second:2,third:3,fourth:4,fifth:5,sixth:6,seventh:7,eighth:8,ninth:9,tenth:10,eleventh:11,twelfth:12};
const DIGITS:Record<string,string>={thumb:'엄지손가락',index:'집게손가락',middle:'가운데손가락',ring:'약손가락',little:'새끼',big:'엄지발가락',central:'중절치',lateral:'측절치'};
function catalogueKorean(input:string):string|null{
 const name=input.trim().toLowerCase();
 const bilateral=name.match(/^(left|right) (.+)$/);
 if(bilateral){const ko=catalogueKorean(bilateral[2])??translatedEntry(bilateral[2])?.ko;if(ko)return (bilateral[1]==='left'?'왼쪽 ':'오른쪽 ')+ko;}
 const middle=name.match(/^(.+?) of (left|right) (.+)$/);
 if(middle){const core=catalogueKorean(middle[1]+' of '+middle[3])??translatedEntry(middle[1]+' of '+middle[3])?.ko;
 if(core)return (middle[2]==='left'?'왼쪽 ':'오른쪽 ')+core;
 const tail=catalogueKorean(middle[3])??translatedEntry(middle[3])?.ko;
 const head=catalogueKorean(middle[1])??translatedEntry(middle[1])?.ko;
 if(tail&&head)return (middle[2]==='left'?'왼쪽 ':'오른쪽 ')+tail+' '+head;
 }
 const numbered=name.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) (cervical|thoracic|lumbar) vertebra$/);
 if(numbered)return ({cervical:'경추',thoracic:'흉추',lumbar:'요추'} as Record<string,string>)[numbered[2]]+' '+ORDINAL_NUMBER[numbered[1]]+'번';
 const disc=name.match(/^intervertebral disk of (.+)$/);
 if(disc){const ko=catalogueKorean(disc[1])??translatedEntry(disc[1])?.ko;if(ko)return ko+' 추간판';}
 const ordinal=name.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) (rib|costal cartilage|metacarpal bone|metatarsal bone)$/);
 if(ordinal)return ORDINAL_NUMBER[ordinal[1]]+'번 '+({'rib':'늑골','costal cartilage':'늑연골','metacarpal bone':'중수골','metatarsal bone':'중족골'} as Record<string,string>)[ordinal[2]];
 const phalanx=name.match(/^(proximal|middle|distal) phalanx of (left|right) (big|fourth|index|little|middle|ring|second|third|thumb) (toe|finger)$/);
 if(phalanx){const side=phalanx[2]==='left'?'왼쪽':'오른쪽';const finger=phalanx[4]==='finger';const digit=({big:'엄지',fourth:'넷째',index:'둘째',little:'새끼',middle:'셋째',ring:'넷째',second:'둘째',third:'셋째',thumb:'엄지'} as Record<string,string>)[phalanx[3]];return side+' '+digit+(finger?'손가락':'발가락')+' '+({proximal:'몸쪽마디뼈',middle:'중간마디뼈',distal:'끝마디뼈'} as Record<string,string>)[phalanx[1]];}
 const tooth=name.match(/^(upper|lower) (first|second|central|lateral)? ?secondary (molar|premolar|incisor|canine) tooth$/);
 if(tooth){const kind=({molar:'큰어금니',premolar:'작은어금니',incisor:'앞니',canine:'송곳니'} as Record<string,string>)[tooth[3]];return (tooth[1]==='upper'?'위턱 ':'아래턱 ')+(tooth[2]?(ORDINAL_NUMBER[tooth[2]]??(tooth[2]==='central'?1:2))+'번째 ':'')+'영구 '+kind;}
 const simple=name.match(/^(left|right) (upper|lower) (.+)$/);
 if(simple){const core=catalogueKorean(simple[2]+' '+simple[3]);if(core)return (simple[1]==='left'?'왼쪽 ':'오른쪽 ')+core;}
 return null;
}
export function getKoreanName(englishName: string): string {
  return translatedEntry(englishName)?.ko ?? catalogueKorean(englishName) ?? fallbackKorean(englishName);
}

const BONE_EXPLANATIONS: Array<[RegExp,string]> = [
 [/scapula/i,'견갑골은 쇄골·상완골과 연결되는 어깨 복합체의 핵심 뼈입니다. 견봉, 오훼돌기, 견갑극과 관절와를 구분하고 견갑골의 상방·하방회전 및 전인·후인을 관찰합니다.'],
 [/clavicle/i,'쇄골은 흉골과 견갑골을 연결하는 지지대 역할을 합니다. 흉쇄관절과 견봉쇄골관절의 움직임이 팔을 머리 위로 들어 올리는 동작에 기여합니다.'],
 [/humerus/i,'상완골은 견갑골 관절와와 어깨관절을 이루고 아래쪽에서 팔꿈치관절을 형성합니다. 상완골두·대결절·소결절·삼각근조면을 구분합니다.'],
 [/radius/i,'요골은 엄지손가락 쪽 전완뼈로 팔꿈치와 손목의 움직임, 전완의 엎침·뒤침에 관여합니다.'],
 [/ulna/i,'척골은 새끼손가락 쪽 전완뼈로 주두와 활차패임을 통해 팔꿈치의 굽힘·폄에 기여합니다.'],
 [/femur/i,'대퇴골은 고관절과 무릎관절을 잇는 긴뼈입니다. 대퇴골두·경부·대전자·소전자 및 관절융기를 구분하고 고관절 움직임과 하중 전달을 관찰합니다.'],
 [/tibia/i,'경골은 체중을 주로 전달하는 종아리의 안쪽 긴뼈입니다. 경골고평부·경골조면·내과와 무릎·발목관절의 관계를 살펴봅니다.'],
 [/fibula/i,'비골은 종아리의 가쪽 긴뼈로 발목 가쪽 안정성과 여러 근육의 부착에 기여합니다. 경골과의 연결과 외과 위치를 관찰합니다.'],
 [/patella/i,'슬개골은 대퇴사두근 힘줄 안에 위치한 종자뼈입니다. 무릎을 펴는 힘의 전달과 슬개대퇴관절의 움직임을 관찰합니다.'],
 [/sacrum/i,'천골은 척주와 골반을 연결하며 천장관절을 통해 몸통의 하중을 골반으로 전달합니다.'],
 [/ilium|ischium|pubis|hip bone/i,'볼기뼈는 장골·좌골·치골이 결합한 구조로 비구를 형성합니다. 고관절의 움직임과 골반의 전방·후방경사를 구분해 관찰합니다.'],
 [/cervical vertebra|atlas|axis/i,'경추는 목의 움직임과 머리 지지에 관여합니다. 척추체·관절돌기·횡돌기와 인접 분절의 관계를 살펴봅니다.'],
 [/thoracic vertebra/i,'흉추는 늑골과 관절을 이루어 흉곽을 구성합니다. 흉추 신전·회전과 늑골의 움직임을 함께 관찰합니다.'],
 [/lumbar vertebra/i,'요추는 몸통의 하중을 전달하고 굴곡·신전에 크게 관여합니다. 분절 움직임과 골반의 움직임을 구분해 관찰합니다.'],
 [/rib|costal cartilage/i,'늑골과 늑연골은 흉곽을 형성하고 호흡 시 흉곽의 확장·수축에 참여합니다. 흉추와 흉골의 연결 관계를 관찰합니다.'],
 [/sternum/i,'흉골은 흉곽 앞쪽의 편평뼈로 늑연골과 쇄골의 연결 지점입니다. 흉골병·몸통·검상돌기를 구분합니다.'],
 [/calcaneus/i,'종골은 발뒤꿈치를 이루며 아킬레스힘줄이 부착합니다. 발목과 발의 하중 전달을 관찰합니다.'],
 [/talus/i,'거골은 경골·비골과 발목관절을 이루고 종골과도 관절합니다. 발목의 발등굽힘·발바닥굽힘을 관찰합니다.'],
 [/metacarpal|carpal|phalanx.*finger/i,'손의 작은 뼈는 손목·손허리·손가락관절을 구성합니다. 관절별 굽힘·폄과 손의 지지 기능을 관찰합니다.'],
 [/metatarsal|tarsal|phalanx.*toe/i,'발의 작은 뼈는 발목과 발가락관절 및 발 아치를 구성합니다. 체중지지와 발가락 움직임을 관찰합니다.'],
 [/tooth|incisor|molar|premolar|canine/i,'치아는 씹기와 음식물 절단에 관여하는 단단한 구강 구조입니다. 위턱·아래턱에서 위치를 구분합니다.'],
 [/cartilage/i,'연골은 부위에 따라 관절면의 마찰을 줄이거나 구조를 지지하는 역할을 합니다. 이 구조가 인접한 뼈 및 연부조직과 어떻게 연결되는지 관찰합니다.'],
];
function boneSummary(name:string):string|null{
 if(/iliotibial tract/i.test(name))return '장경인대는 넙다리 가쪽의 두꺼운 근막 띠입니다. 대퇴근막장근·대둔근의 장력을 전달하는 결합조직입니다.';
 const normalized=name.replace(/\b(left|right)\b/gi,'').trim();
 return BONE_EXPLANATIONS.find(([pattern])=>pattern.test(normalized))?.[1]??null;
}
export function getKoreanSummary(englishName: string): string | null {
  return translatedEntry(englishName)?.summary ?? boneSummary(englishName);
}

export function conceptMatchesKoreanQuery(concept: Concept, query: string): boolean {
  const needle = normalize(query);
  if (!needle) return true;
  if (normalize(concept.name).includes(needle) || normalize(concept.id).includes(needle)) return true;
  const entry = translatedEntry(concept.name);
  if (!entry) return false;
  return [entry.ko, ...entry.aliases].some(candidate => normalize(candidate).includes(needle));
}

/** Search all concepts; retain English and FMA-ID search even for untranslated concepts. */
export function findAnatomyConcepts(atlas: Atlas, query: string, limit = 80): Concept[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    const suggested = [
      'scapula', 'humerus', 'thoracic vertebra', 'zone of deltoid',
      'serratus anterior', 'psoas major', 'gluteus maximus', 'femur',
    ];
    return suggested.map(name => atlas.concepts.find(c => c.name.toLowerCase() === name))
      .filter((concept): concept is Concept => Boolean(concept));
  }
  const matching = atlas.concepts.filter(c => conceptMatchesKoreanQuery(c, query));
  const rank = (c: Concept): number => {
    const english = normalize(c.name);
    const translation = translatedEntry(c.name);
    const localized = translation ? [translation.ko, ...translation.aliases].map(normalize) : [];
    if (english === normalizedQuery || localized.includes(normalizedQuery)) return 0;
    if (english.startsWith(normalizedQuery) || localized.some(s => s.startsWith(normalizedQuery))) return 1;
    return 2;
  };
  return matching.sort((a, b) => rank(a) - rank(b) || a.name.length - b.name.length)
    .slice(0, limit);
}

const SIDE_PREFIX:Record<string,string>={right:'오른쪽',left:'왼쪽',superior:'위',inferior:'아래',anterior:'앞',posterior:'뒤',medial:'안쪽',lateral:'가쪽',deep:'깊은',superficial:'얕은',upper:'위',lower:'아래',middle:'중간',first:'첫째',second:'둘째',third:'셋째',fourth:'넷째',fifth:'다섯째'};
const ANATOMY_WORDS:Record<string,string>={
 'muscle':'근육','bone':'뼈','tendon':'힘줄','ligament':'인대','head':'갈래','belly':'힘살','part':'부분','portion':'부분','zone':'영역','body':'몸통','process':'돌기','tubercle':'결절','tuberosity':'조면','crest':'능선','spine':'가시','fossa':'오목','notch':'패임','surface':'면','border':'모서리','angle':'각','shaft':'몸통','neck':'목','condyle':'관절융기','epicondyle':'상과','trochanter':'돌기','foramen':'구멍','facet':'관절면','articular':'관절','cartilage':'연골','joint':'관절','ramus':'가지','arch':'활','plate':'판','canal':'관','groove':'고랑','line':'선','tuberculum':'결절',
 'cervical':'경추','thoracic':'흉추','lumbar':'요추','sacral':'천추','costal':'늑골','vertebral':'척추','sternal':'흉골','clavicular':'쇄골','scapular':'견갑골','humeral':'상완골','radial':'요골','ulnar':'척골','femoral':'대퇴골','tibial':'경골','fibular':'비골','pelvic':'골반','iliac':'장골','ischial':'좌골','pubic':'치골','occipital':'후두','temporal':'측두','frontal':'전두','parietal':'두정','nasal':'비','maxillary':'상악','mandibular':'하악',
 'long':'긴','short':'짧은','major':'대','minor':'소','maximus':'대','minimus':'소','medius':'중','longus':'장','brevis':'단','magnus':'대','oblique':'사','transverse':'횡','rectus':'직','external':'외','internal':'내','intermediate':'중간','accessory':'부','common':'공통','proximal':'몸쪽','distal':'먼쪽','dorsal':'등쪽','ventral':'배쪽','palmar':'손바닥쪽','plantar':'발바닥쪽',
 'flexor':'굴근','extensor':'신근','abductor':'외전근','adductor':'내전근','rotator':'회전근','levator':'거근','depressor':'하제근','pronator':'회내근','supinator':'회외근','tensor':'긴장근','constrictor':'수축근','sphincter':'괄약근','digitorum':'지','pollicis':'무지','hallucis':'무지','carpi':'수근','radialis':'요측','ulnaris':'척측','brachii':'상완','femoris':'대퇴','capitis':'두','cervicis':'경','thoracis':'흉','abdominis':'복','dorsi':'배','scapulae':'견갑','costae':'늑골',
 'rib':'늑골','vertebra':'척추뼈','phalanx':'지골','metacarpal':'중수골','metatarsal':'중족골','carpal':'수근골','tarsal':'족근골','digit':'손발가락','finger':'손가락','toe':'발가락','foot':'발','hand':'손','arm':'팔','leg':'다리','thigh':'넓적다리','forearm':'아래팔','shoulder':'어깨','hip':'고관절','knee':'무릎','elbow':'팔꿈치','wrist':'손목','ankle':'발목',
 'attachment':'부착','origin':'기시','insertion':'정지','of':'','the':'','and':'및','to':'','at':'','in':'','on':'','with':''
};
const ORDINALS:Record<string,string>={i:'1',ii:'2',iii:'3',iv:'4',v:'5',vi:'6',vii:'7',viii:'8',ix:'9',x:'10',xi:'11',xii:'12'};
/** A cautious fallback label for uncatalogued BodyParts3D concepts.
 * Unresolved technical terms are explicitly marked, not presented as verified translations.
 */
function fallbackKorean(name:string):string{
 const words=name.toLowerCase().replace(/[_-]/g,' ').split(/\s+/).filter(Boolean);
 const translated=words.map(word=>ANATOMY_WORDS[word]??SIDE_PREFIX[word]??ORDINALS[word]??( /^\d+$/.test(word)?word:null));
 if(translated.every(v=>v!==null))return translated.filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
 return '한국어 명칭 확인 중 · '+name;
}
export function getKoreanDescription(name:string,system:SystemId):string{
 const summary=getKoreanSummary(name);
 if(summary)return summary;
 if(system==='skeletal')return '선택한 골격 구조입니다. 뼈의 형태와 인접 관절, 근육 부착 관계를 3D 모델에서 관찰할 수 있습니다. 개별 구조의 상세 설명은 검토 중입니다.';
 if(system==='muscular')return '선택한 근육 구조입니다. 주변 골격과의 위치 관계를 관찰할 수 있습니다. 정확한 기시·정지·작용 정보는 검증된 항목부터 제공합니다.';
 return '선택한 해부학적 구조입니다.';
}

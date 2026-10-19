# 한국어 골격·근육 탐색 — V1

작업 브랜치: `feature/korean-anatomy-v1`. 원본 3D 모델 데이터와 해부학 출처 표기는 변경하지 않았습니다.

## 1차 기능
- 골격계 / 근육계 / 뼈+근육 표시 버튼, 첫 화면 기본 표시를 골격·근육으로 변경
- 한국어 137개 원어 사전(별칭 포함), 영어명 및 FMA ID 검색 병행
- 좌·우 구조의 한국어 명칭 파생 처리 (예: 좌측 견갑골, 오른쪽 전거근)
- 검색 결과, 정보 패널, 3D 호버명 한국어 표시
- 일부 교육용 기초 설명은 한국어로, 번역되지 않은 개념은 원본 영어 유지

## 검증
```sh
npm ci
npm run check
node scripts/validate-korean-anatomy.mjs
node scripts/validate-atlas.mjs
node scripts/validate-interactions.mjs
npm run build
npm run dev
```
검색 예: 견갑골, 어깨뼈, 좌측 견갑골, 삼각근, 전거근, 장요근, scapula, FMA13394.

## 제한
현재 137개 기본 개념만 한국어로 번역됩니다. 기시·정지·신경지배, 기능해부학 교재 수준의 상세 해설 및 관절 운동 애니메이션은 후속 작업입니다. BodyParts3D가 일부 근육을 분할 표현하거나 수록하지 않을 수 있습니다. 모델 원본은 교육용으로, 진단 및 임상 판단용이 아닙니다.

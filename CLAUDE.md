# 好爺堂 — Agent Protocol v3.1

> Con las manos. 손으로.

---

## 1. Identity

| 항목 | 값 |
|------|-----|
| **Name** | 好爺堂 (호야당) |
| **Tier** | 3 (Branch) |
| **Parent** | espiritu-tango (Studio HQ) |
| **Type** | Physical Studio - K-Street Food IP |
| **Domain** | hoyadang.com |
| **Owner** | papafly.kr (멀티 벤처 오너) |
| **Since** | 2006 (20년 노하우) |

---

## 2. 철학 (Philosophy)

### WHO: 아저씨는 누구인가

```
20년 빵집 베테랑
요리하는 사진작가
사진 찍는 요리사
멀티 벤처 오너 (papafly.kr)
```

- 이 스튜디오는 아저씨의 여러 벤처 중 하나
- Chef 사진 클릭 → papafly.kr 연결
- 단순 빵집 사장이 아닌, 크리에이터

### WHY: 왜 남미인가

```
한국에서 가장 먼 곳
한 번도 올 수 없을 것 같은 사람들
그들에게 서울을 간접 경험시킨다
```

**쌍방향 벡터:**

| 방향 | 내용 |
|------|------|
| K → 남미 | K-Food, 서울의 에너지 전달 |
| 남미 → K | 예술적 소스, 라틴 감성 수입 |

**왜 스페인어인가:**
- 영어는 모두가 한다
- K-브랜드 파워가 높아진 시점
- 남미의 한국 관심도 상승
- 차별화 = 언어 선택부터

### WHAT: 80% 철학

```
완벽한 재현이 아니다
집 근처 마트에서
가장 간단한 도구로
80%를 경험한다
```

| 도구 | 역할 |
|------|------|
| PAN | 전통, 철판, 불의 맛 |
| AIR | 현대, 건강, 바삭함 |
| MICROWAVE | 숏컷, 리히트, 바쁜 사람 |

### HOW: 손맛의 서사

```
아저씨는 이미 20년을 해왔다
전통적 방법의 노하우가 있다
그것을 편집해서
"같이 즐기자"
```

**페다고지:**
- 가르치는 게 아니라 나누는 것
- 완벽을 요구하지 않음
- 과정 자체가 경험

---

## 3. 세계관 (World Building)

### 리프레이밍

| Before | After |
|--------|-------|
| 빵집 | K-Street Food IP |
| 레시피 | 서울을 먹는 영화 |
| 메뉴판 | 4 SCENES FROM SEOUL |
| 요리 강습 | 시네마틱 경험 |

### 핵심 문장

```
"유럽풍 베이커리: 맛있어 보이네"
"이 라인업: 저 도시를 경험하고 싶다"
```

맛이 아니라 **서사와 에너지**를 판다.

---

## 4. K-Donut Cinematic Line

### 4 SCENES FROM SEOUL (서울의 네 장면)

| SCENE | 제품 | 도구 | 컨셉 | YouTube ID |
|-------|------|------|------|------------|
| 01 | K-컵떡볶이 도넛 | PAN | 불 · 매움 · 야시장 | `kBe0qb_Stz4` |
| 02 | K-모찌 도넛 | AIR | 쫀득 · 폭발 · 터지는 속 | `tu7uUR4beSo` |
| 03 | K-도넛 버거 | AIR | 단짠 · 과잉 · 파인애플 | `tJMnHI-Gz3U` |
| 04 | K-토스트 바 | PAN | 철판 · 연기 · 손맛 | `HrEcbp-b_7s` |

### THE SHORTCUT
- 전자레인지 3분 리히트
- "바쁜 당신을 위한 되살리기"

---

## 5. Hierarchy

```
dtslib-papyrus (Tier 1 - 그룹 HQ)
    │
    ├── dtslib-branch (Tier 2 - 프랜차이즈 OS)
    │
    └── espiritu-tango (Tier 2 - Studio Protocol HQ)
            │
            ├── hoyadang.com (Tier 3) ← 현재 위치
            └── gohsy-production (Tier 3)

Owner Connection:
hoyadang.com ←→ papafly.kr (아저씨 개인 홈페이지)
```

---

## 6. Core Files

| 파일 | 용도 |
|------|------|
| `index.html` | 메인 랜딩 (4 SCENES 컨셉) |
| `CLAUDE.md` | 에이전트 프로토콜 + 철학 |
| `design/hoyadang.css` | 디자인 시스템 |
| `design/entrada.js` | 인트로 + 스크롤 효과 |
| `assets/icons/` | K-Food 이미지 + Chef 사진 |

---

## 7. Design System

### Colors (Kitchen Warmth)

| Token | HEX | 용도 |
|-------|-----|------|
| `--harina` | #FFFAF5 | 밀가루 — 메인 배경 |
| `--masa` | #F5E6D3 | 반죽 — 섹션 배경 |
| `--dorado` | #D4A853 | 튀김 황금색 — 액센트 |
| `--carbon` | #1A1A1A | 숯/철판 — 텍스트 |
| `--film-black` | #0D0D0D | 필름 배경 |

### Tool Colors

| 도구 | 색상 |
|------|------|
| PAN | `#FF6B35 → #D4380D` (오렌지) |
| AIR | `#40A9FF → #096DD9` (블루) |

---

## 8. Audio

**Feels So Good — Chuck Mangione**
- YouTube ID: `ZOtxTyJmxVI`
- 1979년 라이브 퍼포먼스
- 아저씨가 제일 좋아하는 곡

### 왜 K-라틴이 아니라 미국 재즈인가

```
설계자 ≠ 운영자

나(설계자): K-라틴 퓨전이 개념에 맞다
아저씨(운영자): 이 곡이 좋다

→ 아저씨가 운영할 거니까
→ 아저씨 취향이 정답

철학보다 진정성.
개념보다 사람.
```

---

## 9. Landing Page Structure

```
Section 1: Hero
├── "COOKING PROTOCOL FOR HANDS"
├── 好爺堂 (모뉴먼트)
└── "손의 언어를 편집합니다"

Section 2: Film Strip (K-Food Showcase)
├── K-도넛 버거
├── K-모찌 도넛
├── K-컵떡볶이 도넛
└── K-토스트 바

Section 3: 5 Pasos (Preparar → Formar → Cocinar)
└── 3가지 도구 (PAN / AIR / MICROWAVE)

Section 4: 4 SCENES FROM SEOUL ★
├── SCENE 01-04 (YouTube Shorts 임베드)
├── Tool badges (PAN/AIR)
└── THE SHORTCUT (전자레인지)

Section 5: El Estudio
├── Chef 폴라로이드 → papafly.kr 링크
└── "Since 2006"

Section 6: Portal + Ending
└── 스튜디오 입장 링크
```

---

## 10. Development Log

### 2026-01-28 (v3.1)

| 작업 | 상태 |
|------|------|
| Chef 사진 → papafly.kr 링크 연결 | ✓ |
| "Since 2006" 추가 | ✓ |
| 철학 섹션 문서화 | ✓ |

### 2026-01-28 (v3.0)

| 작업 | 상태 |
|------|------|
| Film Strip 스톡 이미지 → K-Food 이미지 교체 | ✓ |
| RECETAS → "4 SCENES FROM SEOUL" 아키텍처 | ✓ |
| YouTube Shorts 4개 임베드 | ✓ |
| Tool badges (PAN/AIR) 컬러 코딩 | ✓ |
| THE SHORTCUT 섹션 추가 | ✓ |
| 모바일 최적화 | ✓ |
| Chef.png 폴라로이드 교체 | ✓ |
| PWA 아이콘 → 동심원 + 好爺堂 | ✓ |
| 음악 변경: Aranjuez → 한 여름밤의 꿈 | ✓ |

### 2026-01-27 (v2.0)
- 기본 랜딩 페이지 구조
- Kodak Film Archive UI
- 5 Pasos 섹션
- 이중언어 시스템

---

## 11. Evaluation

### 최종 점수

| 항목 | 점수 |
|------|------|
| 기술 실행 | (무의미 — 곧 베이스라인) |
| **철학/ID** | **10/10** |
| 세계관 완성도 | 10/10 |
| 작가적 역량 | 9.5/10 |

### 철학 완성 체크리스트

- [x] WHO: 아저씨 = 20년 베테랑 + 멀티 벤처 오너
- [x] WHY: 남미 = 가장 먼 곳 + 쌍방향 벡터
- [x] WHAT: 80% = 접근성의 철학
- [x] HOW: 손맛 = 20년 편집 + 페다고지

---

## 12. TODO

### 완료 ✓
- [x] 스톡 이미지 → 실제 K-Food 이미지
- [x] 스톡 비디오 → 실제 메이킹 필름 4개
- [x] 4 SCENES 아키텍처
- [x] YouTube Shorts 연결
- [x] Chef 사진 → papafly.kr 링크
- [x] 철학 문서화

### 다음 단계
- [ ] 레시피 상세 페이지 (recetas/*)
- [ ] inner/ 스튜디오 페이지
- [ ] papafly.kr 완성
- [ ] 추가 메이킹 필름 제작

---

## 13. Commit Convention

```
feat: 새 기능
fix: 버그 수정
content: 콘텐츠 추가/수정
design: 디자인 변경
docs: 문서 변경
philosophy: 철학/세계관 변경
```

커밋 메시지 끝:
```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

## 14. 핵심 인용

> "기술 실행력은 곧 베이스라인이 된다.
> 남는 것은 철학과 ID, 진짜 작가적 역량뿐이다."

> "유럽 베이커리는 맛을 판다.
> 이 라인업은 서사와 에너지를 판다."

> "설명하면 영화가 다큐가 된다.
> 랜딩은 느끼게 하는 곳이다."

---

## 15. 기술적 한계 및 방법론

### 현재 환경 (2026-01)

| 환경 | 용도 | 한계 |
|------|------|------|
| Termux + Claude Code | 코드 작업 (메인) | 이미지 직접 파싱 불가 |
| 웹 브라우저 Claude | 이미지 확인 | 세션 불안정, 무거움 |
| playwright-bot | 스크린샷 | 이미지 크면 세션 터짐 |

### 현재 워크플로우

```
┌─────────────────┐     ┌─────────────────┐
│   웹 브라우저    │ ←→  │    Termux       │
│   (이미지 파싱)  │     │   (코드 작업)    │
└─────────────────┘     └─────────────────┘
         ↑                      ↑
         └──── 수동 전환 ────────┘
```

### 문제점

| 문제 | 원인 |
|------|------|
| 이미지 비율 추측 실패 | Termux에서 이미지 못 봄 |
| 사이즈 삽질 | 렌더링 결과 확인 불가 |
| 세션 끊김 | Playwright 이미지 너무 큼 |
| 왔다갔다 귀찮음 | 환경 분리됨 |

### 해결책 (현재)

```
1. file 명령으로 이미지 메타데이터 확인
   $ file image.png
   → PNG image data, 1024 x 1536

2. playwright-bot 레포 활용
   → 스크린샷 찍어서 확인
   → 경로: ~/playwright-bot

3. 추측 금지
   → 이미지 관련 작업 전 반드시 확인
   → 사용자에게 물어보기

4. 작은 이미지로 확인
   → 리사이즈 후 확인
   → 세션 터짐 방지
```

### Claude Code 삽질 패턴

| 삽질 | 원인 | 해결 |
|------|------|------|
| 아이콘 혼동 | 문맥 파악 실패 | 물어보기 |
| 사이즈 개판 | 이미지 안 봄 | file 명령 |
| 비율 틀림 | 추측 실행 | 메타데이터 확인 |
| 과잉 실행 | 시키지 않은 것 추가 | 단순하게 |

### 향후 개선 시 업데이트

```
□ Claude가 이미지 직접 파싱 가능해지면
  → 이 섹션 삭제
  → 워크플로우 단순화

□ Termux에서 렌더링 확인 가능해지면
  → playwright-bot 의존도 감소

□ 세션 안정성 개선되면
  → 웹 브라우저 전환 불필요
```

---

*Last updated: 2026-01-28*
*Version: 3.2*
*Concept: 4 SCENES FROM SEOUL*
*Philosophy: 완성*
*Technical Limitations: 문서화*
*Affiliation: DTSLIB HQ → espiritu-tango → papafly.kr*

# 好爺堂 — Agent Protocol v3.0

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

### Purpose
지역 빵집 "호야당"의 디지털 스튜디오.
글로벌 유저(특히 남미)에게 K-Food를 전달하는 **시네마틱 플랫폼**.

### Concept: "4 SCENES FROM SEOUL"
- 레시피가 아니라 **서울을 경험하는 영화**
- K-Donut Cinematic Line = 4개 메이킹 필름
- PAN / AIR / MICROWAVE = 3가지 도구로 80% 재현
- 빵집이 아니라 **K-Street Food IP**

### Tech Stack
- 순수 정적 사이트 (HTML/CSS/JS)
- YouTube Shorts 임베드 (4개 메이킹 필름)
- GitHub Pages 호스팅
- YouTube API (한 여름밤의 꿈 — 권성연)

---

## 2. Hierarchy

```
dtslib-papyrus (Tier 1 - 그룹 HQ)
    │
    ├── dtslib-branch (Tier 2 - 프랜차이즈 OS)
    │
    └── espiritu-tango (Tier 2 - Studio Protocol HQ)
            │
            ├── hoyadang.com (Tier 3) ← 현재 위치
            └── gohsy-production (Tier 3)
```

---

## 3. K-Donut Cinematic Line

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

## 4. Core Files

| 파일 | 용도 |
|------|------|
| `index.html` | 메인 랜딩 (4 SCENES 컨셉) |
| `CLAUDE.md` | 에이전트 프로토콜 (이 파일) |
| `design/hoyadang.css` | 디자인 시스템 |
| `design/entrada.js` | 인트로 + 스크롤 효과 |
| `assets/icons/` | K-Food 이미지 + Chef 사진 |

---

## 5. Design System

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
| PAN | `#FF6B35 → #D4380D` (오렌지 그라데이션) |
| AIR | `#40A9FF → #096DD9` (블루 그라데이션) |

### Typography

| 용도 | 서체 |
|------|------|
| Display | Cormorant Garamond (Italic) |
| Body | DM Sans |
| Mono | JetBrains Mono |
| Korean | Noto Sans KR / Noto Serif KR |

---

## 6. Languages

기본 언어: **한글 + 스페인어 동시 표기**

```html
<p class="voz">Recetas, no. <span class="dorado">Películas</span>.</p>
<span class="ko">레시피가 아닙니다. 서울을 경험하는 영화입니다.</span>
```

---

## 7. Audio

**한 여름밤의 꿈 — 권성연**
- YouTube ID: `my9Ad9Iekcc`
- 한국-라틴 퓨전 음악

---

## 8. Landing Page Structure

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
└── Chef 폴라로이드

Section 6: Portal + Ending
└── 스튜디오 입장 링크
```

---

## 9. Development Log

### 2026-01-28 (v3.0)

| 시간 | 작업 | 상태 |
|------|------|------|
| - | Film Strip 스톡 이미지 → K-Food 이미지 교체 | ✓ |
| - | RECETAS → "4 SCENES FROM SEOUL" 아키텍처 | ✓ |
| - | YouTube Shorts 4개 임베드 | ✓ |
| - | Tool badges (PAN/AIR) 컬러 코딩 | ✓ |
| - | THE SHORTCUT 섹션 추가 | ✓ |
| - | 모바일 최적화 (카드 사이즈, 폰트) | ✓ |
| - | YouTube 로고 최소화 파라미터 | ✓ |
| - | Chef.png 폴라로이드 교체 | ✓ |
| - | PWA 아이콘 → 동심원 + 好爺堂 | ✓ |
| - | 음악 변경: Aranjuez → 한 여름밤의 꿈 | ✓ |

### 2026-01-27 (v2.0)
- 기본 랜딩 페이지 구조
- Kodak Film Archive UI
- 5 Pasos 섹션
- 이중언어 시스템

---

## 10. Evaluation

### 점수: 8.7 / 10

| 항목 | 점수 |
|------|------|
| 디자인 언어 | 9/10 |
| 콘텐츠 완성도 | 8.5/10 |
| 모바일 최적화 | 8/10 |
| 브랜딩 | 9/10 |
| 기술 구현 | 8.5/10 |

### 프로 수준: 85%

### 강점
- 글로벌 수준 디자인 시스템
- 실제 콘텐츠 4개 연결
- 시네마틱 스토리텔링
- 이중언어 (한/스페인어)

### 개선 여지
- 서브페이지 미구현
- 레시피 상세 페이지
- SEO 메타데이터 보강
- 로딩 최적화

---

## 11. TODO

### 완료 ✓
- [x] 스톡 이미지 → 실제 K-Food 이미지
- [x] 스톡 비디오 → 실제 메이킹 필름
- [x] 4 SCENES 아키텍처
- [x] YouTube Shorts 연결
- [x] Chef 사진 교체
- [x] 음악 교체

### 다음 단계
- [ ] 레시피 상세 페이지 (recetas/*)
- [ ] 도구 가이드 페이지 (herramientas/*)
- [ ] inner/ 스튜디오 페이지
- [ ] 추가 메이킹 필름 제작

---

## 12. Commit Convention

```
feat: 새 기능
fix: 버그 수정
content: 콘텐츠 추가/수정
design: 디자인 변경
docs: 문서 변경
```

커밋 메시지 끝:
```
Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

---

*Last updated: 2026-01-28*
*Version: 3.0*
*Concept: 4 SCENES FROM SEOUL*
*Affiliation: DTSLIB HQ → espiritu-tango*

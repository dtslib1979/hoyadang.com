# 好爺堂 — Agent Protocol v2.0

> Con las manos. 손으로.

---

## 1. Identity

| 항목 | 값 |
|------|-----|
| **Name** | 好爺堂 (호야당) |
| **Tier** | 3 (Branch) |
| **Parent** | espiritu-tango (Studio HQ) |
| **Type** | Physical Studio - Restaurant + K-Food Tutorial |
| **Domain** | hoyadang.com |

### Purpose
지역 빵집 "호야당"의 디지털 스튜디오.
글로벌 유저(특히 남미)에게 K-Food 레시피를 전달하는 튜토리얼 플랫폼.

### Concept: "MANOS" (손)
- 요리는 손으로 합니다
- 호야당 아저씨는 요리사이자 사진작가
- 팬, 에어프라이어, 전자레인지 = 3가지 툴킷
- 80% 재현 가능한 K-Food

### Tech Stack
- 순수 정적 사이트 (HTML/CSS/JS)
- GSAP for animations
- GitHub Pages 호스팅
- YouTube API (Aranjuez 음악)

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

## 3. Core Files

| 파일 | 용도 |
|------|------|
| `index.html` | 메인 랜딩 (MANOS 컨셉) |
| `CLAUDE.md` | 에이전트 프로토콜 (이 파일) |
| `design/hoyadang.css` | 새 디자인 시스템 |
| `FACTORY.json` | 설정 메타데이터 |
| `PLACEHOLDERS.md` | 교체할 영상/이미지 목록 |

---

## 4. Content Structure

```
hoyadang.com/
├── index.html              # 랜딩 — 好爺堂 소개
├── recetas/                # 레시피 목록
│   ├── croqueta/           # 고로케
│   ├── k-donut/            # K-도넛
│   ├── hotteok/            # 호떡
│   └── pan-ajo/            # 마늘빵
├── herramientas/           # 툴킷 가이드
│   ├── sarten/             # 팬
│   ├── airfryer/           # 에어프라이어
│   └── microondas/         # 전자레인지
├── estudio/                # 매장 정보
├── comunidad/              # 커뮤니티
└── assets/
    ├── video/              # 손 영상들 (TODO)
    └── photo/              # 사진들 (TODO)
```

---

## 5. Design System

### Colors (Kitchen Warmth)

| Token | HEX | 용도 |
|-------|-----|------|
| `--harina` | #FFFAF5 | 밀가루 — 메인 배경 |
| `--masa` | #F5E6D3 | 반죽 — 섹션 배경 |
| `--dorado` | #D4A853 | 튀김 황금색 — 액센트 |
| `--carbon` | #1A1A1A | 숯/철판 — 텍스트 |
| `--aceite` | #8B7355 | 기름 — 보조 텍스트 |
| `--tomate` | #C44536 | 토마토 — 강조 |

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
<p class="bilingue-es">Tu cocina. Sabor coreano.</p>
<p class="bilingue-ko">당신의 주방. 한국의 맛.</p>
```

언어 버튼은 **한글**로 표기:
- 한국어
- 스페인어
- 中文

---

## 7. Audio

**Concierto de Aranjuez — II. Adagio**
- Composer: Joaquín Rodrigo
- YouTube ID: `RxWa8tXu8y4`
- 스페인 클래식 기타 협주곡

---

## 8. Commit Convention

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

## 9. Forbidden Terms

사용 금지:
- 탱고, 밀롱가, 퍼포먼스 (espiritu 템플릿 잔재)
- 학원, 레슨, 강습
- Performance Protocol

---

## 10. TODO — 콘텐츠 교체

### 영상 (최우선)

| 위치 | 설명 | 파일명 |
|------|------|--------|
| Intro | 손으로 반죽하는 영상 | `assets/video/manos-intro.mp4` |
| Hero | 아저씨 손 클로즈업 | `assets/video/manos-hero.mp4` |

### 사진

| 위치 | 설명 | 파일명 |
|------|------|--------|
| Film Strip 1 | 재료 손질 | `assets/photo/preparar.jpg` |
| Film Strip 2 | 반죽하는 손 | `assets/photo/formar.jpg` |
| Film Strip 3 | 튀기는 손 | `assets/photo/cocinar.jpg` |
| Film Strip 4 | 접시에 담는 손 | `assets/photo/servir.jpg` |
| Polaroid | 아저씨 포트레이트 | `assets/photo/abuelo.jpg` |
| Recipe Cards | 각 레시피별 손 사진 | `assets/photo/receta-*.jpg` |

---

## 11. LLM Control Interface

이 레포는 GitHub 폐쇄 생태계 내에서 LLM으로 제어됨.

| Action | Method |
|--------|--------|
| READ | `git clone` / file read |
| WRITE | file write / `git commit` |
| EXECUTE | GitHub Actions |
| STATE | `git log` / file content |

---

*Last updated: 2026-01-27*
*Version: 2.0*
*Concept: MANOS (손)*
*Affiliation: DTSLIB HQ → espiritu-tango*

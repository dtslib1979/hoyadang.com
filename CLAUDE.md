# HOYADANG — Agent Protocol v3.0

> Performance Protocol for Body
> "춤을 가르치지 않는다. 몸의 언어를 편집한다."

---

## 1. Identity

### What This Is
**Performance Studio OS** — 몸으로 장면을 만드는 퍼포먼스 프로토콜

### What This Is NOT
- ❌ 탱고 학원 웹사이트
- ❌ 댄스 스쿨
- ❌ 레슨 플랫폼

### Structure
```
HOYADANG (메타 레이어 — Protocol)
    │
    └── Node: Magenta (연화 오프라인 스튜디오)
    └── Node: [Future] (확장 가능)
```

---

## 2. Core Philosophy

| 기존 사고 | Espíritu 사고 |
|----------|--------------|
| 춤을 배운다 | 장면을 만든다 |
| 수강생 | 퍼포머 |
| 수업 | 에피소드 |
| 레벨 | 시즌 |
| 연습 | 실험 |
| 학원 | 스튜디오 |

**핵심 메시지:**
> "탱고는 장르가 아니다. 첫 번째 Body Protocol이다."

---

## 3. Tech Stack

- Pure static site (HTML/CSS/JS)
- GitHub Pages hosting
- Performance Studio Design System (BPM-based)
- Body Interaction Protocol v1.0
- Mobile-Only (430px max-width)
- No Service Worker
- Bing Read-Aloud & Translation Compatible

---

## 4. Architecture: 5-Layer Performance OS

```
hoyadang.com/
├── index.html              # Entry Portal
├── emisión/                # L1: Emission (장면 송출)
│   ├── index.html
│   ├── l1~l4/              # Season 01 Episodes
│   ├── club/               # Studio Pass
│   └── oneday/             # Single Session
├── cuerpo/                 # L2: Body Grammar (몸 언어 편집)
├── laboratorio/            # L3: Gesture Lab (제스처 설계)
├── control/                # L4: Control Room (시스템 관측)
├── legado/                 # L5: Legacy (서사 축적)
├── inner/                  # Hidden Gate (pw: 1126)
├── design/
│   ├── tango.css           # Design System
│   ├── body-protocol.js    # Interaction Protocol
│   └── entrada.js          # Ritual entrance
├── api/
│   ├── gestures.json       # Gesture database
│   └── content.json        # Content endpoint
├── specs/
│   └── constitution.md     # World constitution
├── docs/
│   ├── ARCHITECTURE.md     # Technical docs
│   └── REMODEL-PROPOSAL.md # Transformation plan
├── FACTORY.json            # Core config v3.0
├── branch.json             # HQ identity
└── CLAUDE.md               # This file
```

---

## 5. Layer Definitions

| Layer | Name | Purpose | Verb |
|-------|------|---------|------|
| L1 | Emission | 장면을 송출한다 | Transmití |
| L2 | Body Grammar | 몸의 언어를 편집한다 | Editá |
| L3 | Gesture Lab | 제스처를 설계한다 | Diseñá |
| L4 | Control Room | 시스템을 관측한다 | Observá |
| L5 | Legacy | 서사를 축적한다 | Recordá |

---

## 6. Body Protocol (Interaction Mapping)

| Event | Spanish | Korean | Implementation |
|-------|---------|--------|----------------|
| Scroll | Acercarse | 다가가기 | IntersectionObserver |
| Tap | Compromiso | 결정 | click/touchend |
| Hold 857ms | Esperar | 기다리기 | touchstart + beat |
| Swipe | Girar | 전환 | touchstart/end diff |
| Idle 3s | Respirar | 숨쉬기 | body.respirando |
| Back | Soltar | 놓기 | history.back() |

---

## 7. BPM Timing (70 BPM)

| Token | Value | Use |
|-------|-------|-----|
| --beat | 857ms | Standard transition |
| --half | 428ms | Quick response |
| --double | 1714ms | Slow reveal |
| --breath | 2571ms | Full breath |
| --phrase | 3428ms | 4-bar phrase |

---

## 8. Forbidden Terms

시스템 내에서 사용 금지:
- 학원, 레슨, 강습
- 초급, 중급, 고급
- 수강생, 회원
- 정통, 본고장

---

## 9. Replacement Terms

| 금지 | 대체 |
|------|------|
| 학원 | 스튜디오 |
| 수업 | 에피소드 / 세션 |
| 수강생 | 퍼포머 |
| 레벨 | 시즌 |
| 연습 | 실험 |
| 공연 | 장면 |

---

## 10. Commit Convention

```
feat: New feature
fix: Bug fix
design: Design system changes
content: Content add/modify
arch: Architecture changes
body: Body Protocol changes
identity: Identity/branding changes
```

---

## 11. Gate Code

Inner Portal password: `1126`

---

## 12. Node System

Hoyadang는 메타 레이어.
실제 오프라인 스튜디오는 "Node"로 연결됨.

**Current Nodes:**
- `magenta` — Tango Magenta (Seoul Gangnam) [flagship]

**Future Nodes:**
- `espiritu-food` — Food Protocol
- `espiritu-sound` — Sound Protocol

---

*Last updated: 2026-01-26*
*Version: 3.0 (Performance Studio OS)*
*Affiliation: DTSLIB HQ*

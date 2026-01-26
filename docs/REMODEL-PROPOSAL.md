# ESPÍRITU TANGO — Performance Studio OS

## System Architecture Report v3.0

> "탱고는 목적이 아니다. 첫 번째 프로토콜이다."

**Author**: System Architect
**Date**: 2026-01-26
**Status**: ✅ IMPLEMENTED
**Version**: 3.0.0

---

## Executive Summary

tango-magenta 레포지토리가 **espiritu-tango**로 전환됨.

**Before**: 탱고 마젠타 (연화의 학원 웹사이트)
**After**: ESPÍRITU TANGO (Performance Studio OS + Node System)

**핵심 전환**:
```
연화의 학원 → 박씨의 Performance OS 원형
탱고 = 목적 → 탱고 = 첫 번째 Protocol
마젠타 = 정체성 → 마젠타 = 첫 번째 Node
```

---

## Part 1: New Architecture

### 1.1 Meta-Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   ESPÍRITU TANGO                                            │
│   Performance Protocol for Body                             │
│                                                             │
│   Type: Protocol Layer (Meta)                               │
│   Role: Platform Architect                                  │
│   Owner: dtslib1979                                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   nodes/                                                    │
│   ├── magenta/     ← First Node (Tango Protocol)           │
│   │   └── Operator: 연화 (status: pending)                 │
│   │                                                         │
│   ├── [panaderia]  ← Reserved (Food Protocol)              │
│   ├── [sonido]     ← Reserved (Sound Protocol)             │
│   ├── [dibujo]     ← Reserved (Visual Protocol)            │
│   ├── [aula]       ← Reserved (Lecture Protocol)           │
│   └── [broadcast]  ← Reserved (Media Protocol)             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Hierarchy Clarification

| Role | Entity | 권한 |
|------|--------|------|
| Protocol Architect | dtslib1979 | OS 설계, 노드 승인, 확장 결정 |
| Node Operator | 연화 (pending) | 콘텐츠 운영, 로컬 커스텀 |

**핵심**: 연화가 "안 해도" OS는 굴러감. 연화는 "가능한 첫 번째 노드"일 뿐.

### 1.3 5-Layer Performance OS

```
ESPÍRITU TANGO — 5-Layer Architecture

┌─────────────────────────────────────────────────────────────┐
│  L1: EMISSION          "장면을 송출한다"        Transmití   │
│      → Node-specific content (각 노드별 프로그램)          │
├─────────────────────────────────────────────────────────────┤
│  L2: BODY GRAMMAR      "몸의 언어를 편집한다"   Editá       │
│      → Protocol-level (OS 공통)                            │
├─────────────────────────────────────────────────────────────┤
│  L3: GESTURE LAB       "제스처를 설계한다"      Diseñá      │
│      → Protocol-level (OS 공통)                            │
├─────────────────────────────────────────────────────────────┤
│  L4: CONTROL ROOM      "시스템을 관측한다"      Observá     │
│      → Protocol-level (OS 공통)                            │
├─────────────────────────────────────────────────────────────┤
│  L5: LEGACY            "서사를 축적한다"        Recordá     │
│      → Mixed (OS 기록 + Node 아카이브)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 2: Node Registry System

### 2.1 Registry Structure

```
nodes/
├── registry.json          # 전체 노드 레지스트리
│   ├── protocol           # OS 메타정보
│   ├── nodes[]            # 활성 노드 목록
│   ├── slots[]            # 예약된 확장 슬롯
│   └── howToFork          # 포크 가이드
│
└── magenta/
    └── node.json          # 마젠타 노드 설정
        ├── identity       # 이름, 위치, 연락처
        ├── theme          # 컬러 스킨
        ├── content.owns   # 소유 콘텐츠 경로
        ├── programs       # L1 프로그램 정의
        └── operator       # 운영자 정보
```

### 2.2 Node: Magenta Specification

```json
{
  "id": "magenta",
  "identity": {
    "name": "Tango Magenta",
    "protocol": "tango",
    "location": "Seoul Gangnam"
  },
  "content": {
    "owns": ["emisión/", "magenta.mp4", "shoes.png"]
  },
  "operator": {
    "name": "연화",
    "status": "pending"
  }
}
```

### 2.3 Reserved Expansion Slots

| Slot ID | Protocol | 용도 | Status |
|---------|----------|------|--------|
| panaderia | food | 빵집/음식 스튜디오 | reserved |
| sonido | sound | 음악/사운드 스튜디오 | reserved |
| dibujo | visual | 드로잉/비주얼 스튜디오 | reserved |
| aula | lecture | 강의/교육 스튜디오 | reserved |
| broadcast | media | 방송/미디어 스튜디오 | reserved |

---

## Part 3: Implementation Changelog

### 3.1 Repository Transformation

| Before | After |
|--------|-------|
| Repo: `tango-magenta` | Repo: `espiritu-tango` |
| Identity: 탱고 마젠타 | Identity: ESPÍRITU TANGO |
| Type: 학원 웹사이트 | Type: Performance Studio OS |
| Tagline: El primer sistema que respira | Tagline: Performance Protocol for Body |

### 3.2 Files Changed

**Core Identity (P0)**
- [x] `FACTORY.json` — v3.0, meta.registry 추가
- [x] `branch.json` — 새 정체성
- [x] `CLAUDE.md` — Agent Protocol v3.0
- [x] `index.html` — Hero, Layer cards, Footer 전면 교체
- [x] `manifest.webmanifest` — 새 정체성

**Node System (P0)**
- [x] `nodes/registry.json` — 노드 레지스트리 생성
- [x] `nodes/magenta/node.json` — 마젠타 노드 설정

**Documentation (P1)**
- [x] `docs/ARCHITECTURE.md` — 기술 문서
- [x] `docs/REMODEL-PROPOSAL.md` — 이 문서

### 3.3 index.html Transformation

**Hero Section**
```
Before: "TANGO MAGENTA — El primer sistema que respira"
After:  "ESPÍRITU TANGO — Performance Protocol for Body"
        "춤을 가르치지 않습니다. 몸의 언어를 편집합니다."
```

**Layer Cards**
| Before | After |
|--------|-------|
| 1F — ACADEMIA | L1 — EMISSION |
| 2F — TUTORIAL | L2 — BODY GRAMMAR |
| 3F — GESTURE LAB | L3 — GESTURE LAB |
| 4F — CONTROL | L4 — CONTROL ROOM |
| 5F — STRATEGY | L5 — LEGACY |

**Footer**
```
Before: "TANGO MAGENTA © 2026"
After:  "ESPÍRITU TANGO © 2026 Performance Protocol · Node: Magenta"
```

---

## Part 4: Strategic Framework

### 4.1 Position Clarification

```
Before (문제):
┌──────────────────────────────┐
│  연화 학원 → 박씨가 만듦     │
│  "네가 나 따라와"            │
│  감정 싸움, 주도권 문제      │
└──────────────────────────────┘

After (해결):
┌──────────────────────────────┐
│  박씨 OS → 연화가 합류 가능  │
│  "이미 있는 시스템에 합류"   │
│  자연스러운 위계             │
└──────────────────────────────┘
```

### 4.2 Independence Guarantee

```
연화가 "해볼래" → Node: Magenta 활성화
연화가 "싫어"   → OS는 그대로 동작, 다른 노드로 확장

시스템은 특정 인물에 의존하지 않는다.
```

### 4.3 Fork Protocol

연화가 참여 결정 시:
```bash
1. nodes/magenta/node.json → operator.status: "active"
2. 스킨 커스텀 (색상, 카피, 레퍼런스)
3. 끝.
```

---

## Part 5: Terminology Standards

### 5.1 Forbidden Terms

시스템 내 사용 금지:
- 학원, 레슨, 강습
- 초급, 중급, 고급
- 수강생, 회원
- 정통, 본고장

### 5.2 Replacement Terms

| 금지 | 대체 |
|------|------|
| 학원 | 스튜디오 |
| 수업 | 에피소드 / 세션 |
| 수강생 | 퍼포머 |
| 레벨 | 시즌 |
| 연습 | 실험 |
| 공연 | 장면 |

### 5.3 Core Message

> "춤을 가르치지 않는다. 몸의 언어를 편집한다."
> "No enseñamos baile. Editamos el lenguaje del cuerpo."

---

## Part 6: Validation

### 6.1 Identity Test

| Question | Expected |
|----------|----------|
| 이 사이트는 탱고 학원인가? | **No** |
| 연화의 사업체인가? | **No** (Node일 뿐) |
| 이 구조를 다른 도메인에 복제할 수 있나? | **Yes** |
| 연화 없이 동작하나? | **Yes** |
| 이건 OS인가? | **Yes** |

### 6.2 Architecture Test

```
✅ Protocol Layer와 Node Layer 분리됨
✅ 노드 레지스트리 시스템 구축됨
✅ 확장 슬롯 5개 예약됨
✅ 마젠타 콘텐츠 분리 완료
✅ Fork 프로토콜 정의됨
```

---

## Conclusion

### 한 문장 요약

> "이 레포는 이제 누구든 올라탈 수 있는 판이다."

### 구현 결과

| 항목 | 상태 |
|------|------|
| Repository Rename | ✅ espiritu-tango |
| Identity Transform | ✅ Performance Protocol |
| Node System | ✅ registry.json + magenta/node.json |
| index.html | ✅ 전면 교체 |
| Documentation | ✅ 완료 |

### 다음 단계

1. **L1 emisión 내부 페이지** — 에피소드 언어로 전환
2. **L2-L5 페이지** — Protocol 언어 통일
3. **Node 운영자 대기** — 연화 결정 시 활성화

---

*Implemented by System Architect*
*2026-01-26*
*ESPÍRITU TANGO v3.0*

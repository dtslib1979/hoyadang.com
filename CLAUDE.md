# HOYADANG — Agent Protocol v1.0

> 빵으로 동네를 만든다

---

## 1. Identity

| 항목 | 값 |
|------|-----|
| **Tier** | 3 (Branch) |
| **Parent** | espiritu-tango (Studio HQ) |
| **Type** | Physical Studio - Restaurant |
| **Domain** | hoyadang.com (예정) |

### Purpose
지역 빵집 "호야당"의 디지털 스튜디오. 빵과 동네 문화를 연결하는 물성화된 공간.

### Tech Stack
- 순수 정적 사이트 (HTML/CSS/JS)
- GitHub Pages 호스팅
- DTSLIB Design System (espiritu-tango 상속)

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
| `index.html` | 메인 랜딩 |
| `CLAUDE.md` | 에이전트 프로토콜 (이 파일) |
| `FACTORY.json` | 설정 메타데이터 |
| `branch.json` | HQ 연동 정보 |
| `design/` | 디자인 시스템 |
| `emisión/` | 콘텐츠 섹션 (메뉴/스토리) |

---

## 4. Content Structure (TODO)

```
hoyadang.com/
├── index.html          # 랜딩 — 빵집 소개
├── menu/               # 메뉴판
├── story/              # 호야당 이야기
├── location/           # 위치/영업시간
└── daily/              # 오늘의 빵
```

---

## 5. Commit Convention

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

## 6. Forbidden Terms

사용 금지:
- 탱고, 밀롱가, 퍼포먼스 (espiritu 템플릿 잔재)
- 학원, 레슨, 강습

---

## 7. LLM Control Interface

이 레포는 GitHub 폐쇄 생태계 내에서 LLM으로 제어됨.

| Action | Method |
|--------|--------|
| READ | `git clone` / file read |
| WRITE | file write / `git commit` |
| EXECUTE | GitHub Actions |
| STATE | `git log` / file content |

---

*Last updated: 2026-01-26*
*Version: 1.0*
*Affiliation: DTSLIB HQ → espiritu-tango*

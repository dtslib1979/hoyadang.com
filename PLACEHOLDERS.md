# 好爺堂 — 플레이스홀더 교체 가이드

> 현재 Pexels 무료 이미지/영상 사용 중. 실제 촬영 후 교체 필요.

---

## 영상 (VIDEO)

### 1. Intro Video (최우선)
- **현재**: Pexels placeholder
- **교체 대상**: `assets/video/manos-intro.mp4`
- **촬영 가이드**:
  - 밀가루 묻은 손이 반죽을 치대는 장면
  - 슬로우 모션 (60fps 권장)
  - 4-6초 길이
  - 어두운 배경, 손에 조명 집중
  - 세로 영상 (9:16) 권장

```html
<!-- index.html Line 69-74 -->
<video class="intro-video" ...>
  <source src="assets/video/manos-intro.mp4" type="video/mp4">
</video>
```

### 2. Hero Video
- **현재**: Pexels placeholder
- **교체 대상**: `assets/video/manos-hero.mp4`
- **촬영 가이드**:
  - 요리하는 손 클로즈업
  - 반죽, 빚기, 튀기기 중 선택
  - 자연광 또는 따뜻한 조명
  - 10-15초 루프 가능하게
  - 가로 영상 (16:9) 권장

```html
<!-- index.html Line 91-97 -->
<video class="hero-video" ...>
  <source src="assets/video/manos-hero.mp4" type="video/mp4">
</video>
```

---

## 사진 (PHOTO)

### Film Strip — 요리 과정 4단계

| # | 단계 | 현재 Pexels URL | 교체 대상 | 촬영 가이드 |
|---|------|-----------------|-----------|-------------|
| 1 | Preparar (준비) | `pexels-photo-8477066` | `assets/photo/preparar.jpg` | 재료 손질하는 손, 도마 위 |
| 2 | Formar (빚기) | `pexels-photo-6287525` | `assets/photo/formar.jpg` | 반죽 빚는 손, 밀가루 묻은 |
| 3 | Cocinar (요리) | `pexels-photo-6941010` | `assets/photo/cocinar.jpg` | 팬에서 튀기는 손 |
| 4 | Servir (담기) | `pexels-photo-6287519` | `assets/photo/servir.jpg` | 접시에 담는 손 |

```html
<!-- index.html Line 151-200 -->
<img class="film-imagen" src="assets/photo/preparar.jpg" ...>
<img class="film-imagen" src="assets/photo/formar.jpg" ...>
<img class="film-imagen" src="assets/photo/cocinar.jpg" ...>
<img class="film-imagen" src="assets/photo/servir.jpg" ...>
```

### 레시피 카드 썸네일

| 레시피 | 현재 | 교체 대상 | 촬영 가이드 |
|--------|------|-----------|-------------|
| Croqueta (고로케) | `pexels-photo-6941028` | `assets/photo/receta-croqueta.jpg` | 고로케 빚는 손 |
| K-Donut (케이도넛) | `pexels-photo-4686818` | `assets/photo/receta-donut.jpg` | 도넛 반죽하는 손 |
| Hotteok (호떡) | `pexels-photo-5792329` | `assets/photo/receta-hotteok.jpg` | 호떡 눌러주는 손 |
| Pan de Ajo (마늘빵) | `pexels-photo-1775043` | `assets/photo/receta-pan-ajo.jpg` | 마늘버터 바르는 손 |

```html
<!-- index.html Line 262-334 -->
<img class="receta-imagen" src="assets/photo/receta-croqueta.jpg" ...>
<img class="receta-imagen" src="assets/photo/receta-donut.jpg" ...>
<img class="receta-imagen" src="assets/photo/receta-hotteok.jpg" ...>
<img class="receta-imagen" src="assets/photo/receta-pan-ajo.jpg" ...>
```

### 아저씨 포트레이트

- **현재**: `pexels-photo-3814446`
- **교체 대상**: `assets/photo/abuelo.jpg`
- **촬영 가이드**:
  - 호야당 아저씨 반신 포트레이트
  - 손에 카메라 or 요리도구
  - 필름 느낌 색보정 (Kodak Portra 400)
  - 자연스러운 미소
  - 주방 배경 권장

```html
<!-- index.html Line 358-360 -->
<img class="polaroid-imagen" src="assets/photo/abuelo.jpg" ...>
```

### Ending 이미지

- **현재**: `pexels-photo-6287495`
- **교체 대상**: `assets/photo/manos-limpias.jpg`
- **촬영 가이드**:
  - 손 닦는 장면 or 깨끗한 손
  - 원형 크롭 가능하게
  - 밝은 톤

```html
<!-- index.html Line 469 -->
<img src="assets/photo/manos-limpias.jpg" ...>
```

---

## 촬영 팁

### 장비 권장
- 카메라: 풀프레임 미러리스 (Sony A7, Canon R 등)
- 렌즈: 50mm f/1.8 이상 (아웃포커스용)
- 조명: 자연광 or 링라이트
- 삼각대 필수 (영상)

### 색보정
- 따뜻한 톤 (Yellow +10, Orange +5)
- 약간의 필름 그레인
- 하이라이트 살짝 노출 오버
- 그림자 살짝 밝게

### 손 촬영 팁
- 밀가루 묻은 손 = 질감 좋음
- 손등보다 손바닥 동작 위주
- 반지, 시계 제거
- 손톱 정리

---

## 교체 방법

1. 촬영한 파일을 `assets/video/` 또는 `assets/photo/`에 저장
2. `index.html`에서 Pexels URL을 로컬 경로로 변경
3. 커밋 & 푸시

```bash
# 예시
git add assets/photo/preparar.jpg
git commit -m "content: 실제 손 사진으로 교체 (preparar)"
git push
```

---

*Last updated: 2026-01-27*

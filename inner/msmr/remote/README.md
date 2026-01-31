# MSMR Remote Executor

핸드폰에서 명령어 → PC에서 실행

## 구조

```
📱 핸드폰
   │
   │ Telegram 메시지
   ▼
🤖 Telegram Bot (PC에서 실행 중)
   │
   │ ffmpeg 명령어 실행
   ▼
📁 영상 파일 처리 완료
   │
   │ 완료 알림
   ▼
📱 핸드폰에서 알림 수신
```

## 설치 방법

### 1. Telegram Bot 만들기

1. Telegram에서 **@BotFather** 검색
2. `/newbot` 입력
3. 봇 이름 입력 (예: MSMR Executor)
4. 봇 username 입력 (예: msmr_executor_bot)
5. **토큰 복사** (중요!)

### 2. PC에 Python 설치

```bash
# Windows
winget install Python.Python.3

# Mac
brew install python

# Linux
sudo apt install python3 python3-pip
```

### 3. 라이브러리 설치

```bash
pip install python-telegram-bot
```

### 4. 봇 설정

`telegram_bot.py` 파일 열어서 수정:

```python
# 1. 토큰 입력
TOKEN = "여기에_봇파더에서_받은_토큰_붙여넣기"

# 2. 영상 폴더 설정
VIDEOS_DIR = "C:/Users/아저씨/Videos"  # Windows
# 또는
VIDEOS_DIR = "/home/user/Videos"  # Mac/Linux

# 3. (선택) 허용 사용자 ID
ALLOWED_USERS = [123456789]  # @userinfobot으로 확인
```

### 5. 봇 실행

```bash
python telegram_bot.py
```

PC를 켜놓는 동안 계속 실행됨.

## 사용 방법

### 1. MSMR에서 명령어 생성

1. hoyadang.com/inner/msmr/ 접속
2. [Local] 탭
3. 파일명, 컷 포인트 입력
4. "명령어 생성"
5. "Telegram 전송" 클릭

### 2. 또는 직접 메시지

Telegram에서 봇에게 직접 명령어 전송:

```
ffmpeg -ss 00:01:30 -to 00:02:00 -i "MVI_0001.MP4" -c copy "clip_01.mp4"
```

### 3. 결과 확인

봇이 자동으로 알림:
- ✅ 완료! (3.2초)
- ❌ 실패: 파일을 찾을 수 없습니다

## 봇 명령어

| 명령어 | 설명 |
|--------|------|
| `/start` | 시작, 사용법 안내 |
| `/status` | 폴더 내 영상 파일 목록 |

## 보안

- ffmpeg 명령어만 허용
- 위험한 명령어 차단 (rm, sudo, | 등)
- ALLOWED_USERS로 사용자 제한 가능

## 트러블슈팅

### "토큰이 유효하지 않습니다"
→ BotFather에서 토큰 다시 확인

### "파일을 찾을 수 없습니다"
→ VIDEOS_DIR 경로 확인
→ 파일명 정확히 입력

### "권한이 없습니다"
→ ALLOWED_USERS에 자신의 ID 추가
→ @userinfobot으로 ID 확인

---

*MSMR v3.0 — 好爺堂 Studio OS*

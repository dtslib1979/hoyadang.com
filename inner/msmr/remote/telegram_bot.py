#!/usr/bin/env python3
"""
MSMR Remote Executor — Telegram Bot
好爺堂 Studio OS v3.0

PC에서 이 스크립트를 실행하면:
1. Telegram 메시지로 ffmpeg 명령어 수신
2. 명령어 실행
3. 결과 알림 전송

설치:
    pip install python-telegram-bot

사용:
    1. @BotFather에서 봇 생성 → 토큰 받기
    2. 아래 TOKEN 변경
    3. python telegram_bot.py 실행
    4. Telegram에서 봇에게 ffmpeg 명령어 전송
"""

import os
import subprocess
import logging
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════════
# 설정 — 이 부분만 수정하세요
# ═══════════════════════════════════════════════════════════════════════════

# Telegram Bot 토큰 (@BotFather에서 받은 것)
TOKEN = "YOUR_BOT_TOKEN_HERE"

# 영상 파일이 있는 폴더 (기본값: 현재 폴더)
VIDEOS_DIR = os.path.expanduser("~/Videos")

# 허용된 사용자 ID (보안용, 빈 리스트면 모두 허용)
# Telegram에서 @userinfobot으로 자신의 ID 확인 가능
ALLOWED_USERS = []  # 예: [123456789, 987654321]

# ═══════════════════════════════════════════════════════════════════════════
# 코드 — 수정 불필요
# ═══════════════════════════════════════════════════════════════════════════

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)


def is_safe_command(cmd: str) -> bool:
    """명령어 보안 검증"""
    cmd = cmd.strip()

    # ffmpeg 명령어만 허용
    if not cmd.startswith('ffmpeg '):
        return False

    # 위험한 패턴 차단
    dangerous = ['rm ', 'sudo', '>', '>>', '|', ';', '&&', '$(', '`']
    for d in dangerous:
        if d in cmd:
            return False

    return True


def execute_ffmpeg(cmd: str, cwd: str) -> dict:
    """FFmpeg 명령어 실행"""
    start_time = datetime.now()

    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=600  # 10분 타임아웃
        )

        elapsed = (datetime.now() - start_time).total_seconds()

        if result.returncode == 0:
            return {
                'success': True,
                'message': f'✅ 완료! ({elapsed:.1f}초)',
                'output': result.stdout[-500:] if result.stdout else ''
            }
        else:
            return {
                'success': False,
                'message': f'❌ 실패 (코드: {result.returncode})',
                'output': result.stderr[-500:] if result.stderr else ''
            }

    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'message': '❌ 타임아웃 (10분 초과)',
            'output': ''
        }
    except Exception as e:
        return {
            'success': False,
            'message': f'❌ 오류: {str(e)}',
            'output': ''
        }


# Telegram Bot 핸들러
try:
    from telegram import Update
    from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

    async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """시작 명령어"""
        user_id = update.effective_user.id
        await update.message.reply_text(
            f"🎬 MSMR Remote Executor\n\n"
            f"ffmpeg 명령어를 보내면 실행합니다.\n\n"
            f"예시:\n"
            f"ffmpeg -ss 00:01:30 -to 00:02:00 -i \"video.mp4\" -c copy \"clip.mp4\"\n\n"
            f"📁 작업 폴더: {VIDEOS_DIR}\n"
            f"🆔 사용자 ID: {user_id}"
        )

    async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """메시지 처리"""
        user_id = update.effective_user.id

        # 사용자 검증
        if ALLOWED_USERS and user_id not in ALLOWED_USERS:
            await update.message.reply_text("⛔ 권한이 없습니다.")
            return

        cmd = update.message.text.strip()

        # 명령어 검증
        if not is_safe_command(cmd):
            await update.message.reply_text(
                "⚠️ ffmpeg 명령어만 허용됩니다.\n\n"
                "올바른 형식:\n"
                "ffmpeg -ss 00:01:30 -to 00:02:00 -i \"video.mp4\" -c copy \"clip.mp4\""
            )
            return

        # 실행 시작 알림
        await update.message.reply_text("⏳ 실행 중...")
        logger.info(f"실행: {cmd}")

        # 명령어 실행
        result = execute_ffmpeg(cmd, VIDEOS_DIR)

        # 결과 전송
        response = result['message']
        if result['output']:
            response += f"\n\n```\n{result['output']}\n```"

        await update.message.reply_text(response, parse_mode='Markdown')
        logger.info(f"결과: {result['message']}")

    async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
        """상태 확인"""
        # 폴더 내 파일 목록
        try:
            files = os.listdir(VIDEOS_DIR)
            video_files = [f for f in files if f.endswith(('.mp4', '.MP4', '.mov', '.MOV', '.avi', '.mkv'))]

            if video_files:
                file_list = '\n'.join(f"• {f}" for f in video_files[:20])
                if len(video_files) > 20:
                    file_list += f"\n... 외 {len(video_files) - 20}개"
            else:
                file_list = "(영상 파일 없음)"

            await update.message.reply_text(
                f"📊 상태\n\n"
                f"📁 폴더: {VIDEOS_DIR}\n"
                f"🎬 영상 파일:\n{file_list}"
            )
        except Exception as e:
            await update.message.reply_text(f"❌ 오류: {str(e)}")

    def main():
        """봇 실행"""
        if TOKEN == "YOUR_BOT_TOKEN_HERE":
            print("❌ 오류: TOKEN을 설정하세요!")
            print("1. Telegram에서 @BotFather 검색")
            print("2. /newbot으로 봇 생성")
            print("3. 받은 토큰을 이 파일의 TOKEN에 입력")
            return

        print("🎬 MSMR Remote Executor 시작...")
        print(f"📁 작업 폴더: {VIDEOS_DIR}")
        print("Ctrl+C로 종료")

        app = Application.builder().token(TOKEN).build()

        app.add_handler(CommandHandler("start", start))
        app.add_handler(CommandHandler("status", status))
        app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

        app.run_polling()

    if __name__ == '__main__':
        main()

except ImportError:
    print("❌ python-telegram-bot 설치 필요:")
    print("   pip install python-telegram-bot")

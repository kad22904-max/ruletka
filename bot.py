import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# ===== НАСТРОЙКИ =====
BOT_TOKEN = "8106122467:AAGusptVHcjPAVoxu6n7lM_-WX5vriHLPhU"  # замените
ADMIN_ID = 8936341915              # ваш ID

logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# ===== ССЫЛКА НА ВАШУ СТРАНИЦУ =====
# Загрузите webapp.html, style.css, script.js на GitHub Pages
# и вставьте сюда полную ссылку
WEBAPP_URL = "https://kad22904-max.github.io/tap-miniapp/webapp.html"

# ===== КОМАНДА /start =====
@dp.message(Command("start"))
async def start_command(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎁 Открыть подарок", web_app=WebAppInfo(url=WEBAPP_URL))]
    ])
    await message.answer(
        "Нажми на подарок и тапай, чтобы выиграть! 🎉\n\n"
        "Менеджер: @Henryus22",
        reply_markup=keyboard
    )

# ===== ЗАПУСК =====
async def main():
    print("🚀 Бот запущен!")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
console.log('✅ script.js загружен!');

const TAPS_TO_WIN = 100;
const STORAGE_KEY = 'tapData';

let taps = 0;
let won = false;

const percentDisplay = document.getElementById('percentDisplay');
const tapCounter = document.getElementById('tapCounter');
const giftImage = document.getElementById('giftImage');
const winOverlay = document.getElementById('winOverlay');

// ===== ПРОЦЕНТ НА ДЕНЬ =====
function getDailyPercent() {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash * 31 + today.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return 10 + (hash % 81); // от 10 до 90
}

// ===== ЗАГРУЗКА СОСТОЯНИЯ =====
function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            taps = parsed.taps || 0;
            won = parsed.won || false;
            if (won) {
                winOverlay.classList.add('active');
            }
        }
    } catch (e) {
        console.warn('Ошибка загрузки:', e);
    }
    updateUI();
}

// ===== СОХРАНЕНИЕ =====
function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ taps, won }));
    } catch (e) {
        console.warn('Ошибка сохранения:', e);
    }
}

// ===== ОБНОВЛЕНИЕ ЭКРАНА =====
function updateUI() {
    const percent = getDailyPercent();
    percentDisplay.textContent = percent + '%';
    tapCounter.textContent = `Тапов: ${taps} / ${TAPS_TO_WIN}`;
    console.log('Обновлено UI, тапов:', taps);
}

// ===== ОБРАБОТЧИК ТАПА =====
function handleTap(event) {
    console.log('🔨 Тап! Текущие тапы:', taps);
    
    if (won) {
        console.log('🚫 Уже победа, тап заблокирован');
        return;
    }

    taps++;
    updateUI();
    saveState();

    // Анимация нажатия
    giftImage.style.transform = 'scale(0.92)';
    setTimeout(() => {
        giftImage.style.transform = 'scale(1)';
    }, 80);

    // Проверка победы
    if (taps >= TAPS_TO_WIN && !won) {
        won = true;
        saveState();
        winOverlay.classList.add('active');
        console.log('🏆 ПОБЕДА!');
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM загружен');
    loadState();

    // Вешаем обработчики
    giftImage.addEventListener('click', handleTap);
    giftImage.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleTap(e);
    });

    console.log('👂 Обработчики навешаны');
});

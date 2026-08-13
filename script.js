const TAPS_TO_WIN = 100;
const PERCENT_MIN = 10;
const PERCENT_MAX = 90;
const STORAGE_KEY = 'tapData';

let state = {
    taps: 0,
    percent: 70,
    won: false
};

const percentDisplay = document.getElementById('percentDisplay');
const tapCounter = document.getElementById('tapCounter');
const giftImage = document.getElementById('giftImage');
const winOverlay = document.getElementById('winOverlay');
const ripple = document.getElementById('ripple');

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            state.taps = parsed.taps || 0;
            state.won = parsed.won || false;
            state.percent = getDailyPercent();
            if (state.won) {
                winOverlay.classList.add('active');
            }
        } else {
            state.percent = getDailyPercent();
        }
    } catch {
        state.percent = getDailyPercent();
    }
    updateUI();
}

function getDailyPercent() {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = (hash * 31 + today.charCodeAt(i)) & 0xFFFFFFFF;
    }
    const normalized = (hash % (PERCENT_MAX - PERCENT_MIN + 1)) + PERCENT_MIN;
    return Math.min(PERCENT_MAX, Math.max(PERCENT_MIN, normalized));
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        taps: state.taps,
        won: state.won
    }));
}

function updateUI() {
    percentDisplay.textContent = state.percent + '%';
    tapCounter.textContent = `Тапов: ${state.taps} / ${TAPS_TO_WIN}`;
    
    if (state.percent < 30) {
        percentDisplay.style.color = '#ff6b6b';
    } else if (state.percent < 60) {
        percentDisplay.style.color = '#ffd93d';
    } else {
        percentDisplay.style.color = '#6bcb77';
    }
}

function handleTap(e) {
    if (state.won) return;
    
    state.taps++;
    updateUI();
    saveState();
    
    // РИППЛ ЭФФЕКТ
    const rect = giftImage.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || rect.left + rect.width/2) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || rect.top + rect.height/2) - rect.top;
    const rippleClone = ripple.cloneNode(true);
    rippleClone.style.left = (x - 30) + 'px';
    rippleClone.style.top = (y - 30) + 'px';
    rippleClone.style.width = '60px';
    rippleClone.style.height = '60px';
    rippleClone.style.position = 'absolute';
    rippleClone.style.borderRadius = '50%';
    rippleClone.style.background = 'rgba(255, 215, 0, 0.25)';
    rippleClone.style.transform = 'scale(0)';
    rippleClone.style.animation = 'rippleAnim 0.5s ease-out forwards';
    rippleClone.style.pointerEvents = 'none';
    giftImage.parentElement.appendChild(rippleClone);
    setTimeout(() => rippleClone.remove(), 600);
    
    // АНИМАЦИЯ НАЖАТИЯ
    giftImage.style.transform = 'scale(0.92)';
    setTimeout(() => {
        giftImage.style.transform = 'scale(1)';
    }, 80);
    
    // ПРОВЕРКА ПОБЕДЫ
    if (state.taps >= TAPS_TO_WIN && !state.won) {
        state.won = true;
        saveState();
        winOverlay.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadState();
    
    giftImage.addEventListener('click', handleTap);
    giftImage.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleTap(e);
    });
});
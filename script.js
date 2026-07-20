/* global lucide */

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwIHExISbirVbZ12WjW7I0okSwIE3kJs6pYIZesrmUY6nm6mi0onbBU2GFC58dII-rbWA/exec';

// ── Lucide icons ──
lucide.createIcons();

// ── Header scroll + mobile menu ──
const header = document.getElementById('header');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ── Pricing tabs ──
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    tabPanels.forEach((panel) => {
      panel.classList.toggle('hidden', panel.id !== `tab-${tab}`);
    });
  });
});

// ── Mood picker ──
const nailShape = document.getElementById('nail-shape');
const nailSparkle = document.getElementById('nail-sparkle');
const moodResult = document.getElementById('mood-result');
const nailPreview = document.getElementById('nail-preview');

const shapes = {
  almond: 'M35,180 Q30,120 35,60 Q40,20 60,10 Q80,20 85,60 Q90,120 85,180 Z',
  square: 'M32,180 L32,55 Q32,15 60,12 Q88,15 88,55 L88,180 Z',
  oval: 'M38,180 Q28,120 38,55 Q42,12 60,10 Q78,12 82,55 Q92,120 82,180 Z',
  stiletto: 'M40,180 Q35,120 42,70 Q48,25 60,8 Q72,25 78,70 Q85,120 80,180 Z',
};

const shapeLabels = {
  almond: 'Миндаль',
  square: 'Квадрат',
  oval: 'Овал',
  stiletto: 'Стилет',
};

const colorLabels = {
  lavender: 'Нежная Лаванда',
  nude: 'Розовый нюд',
  bordeaux: 'Страстный бордо',
  french: 'Френч',
  glitter: 'Сияющий глиттер',
};

const colorFills = {
  lavender: '#D8B4FE',
  nude: '#F5C6D0',
  bordeaux: '#7F1D1D',
  french: 'url(#french-grad)',
  glitter: 'url(#glitter-grad)',
};

const advice = {
  almond: {
    lavender: 'Миндаль + Нежная Лаванда — идеальный выбор для утончённого и романтичного образа на эту неделю!',
    nude: 'Миндаль + Розовый нюд — классика, которая подчеркнёт естественную красоту и ухоженность рук.',
    bordeaux: 'Миндаль + Страстный бордо — смелый акцент для вечернего выхода и уверенного настроения.',
    french: 'Миндаль + Френч — вечная элегантность: аккуратный и статусный образ на каждый день.',
    glitter: 'Миндаль + Сияющий глиттер — праздничное сияние для особого случая или просто хорошего настроения!',
  },
  square: {
    lavender: 'Квадрат + Нежная Лаванда — современный минимализм с нежным лавандовым акцентом.',
    nude: 'Квадрат + Розовый нюд — деловой и аккуратный look, который впишется в любой dress code.',
    bordeaux: 'Квадрат + Страстный бордо — графичная форма и глубокий цвет создают эффектный контраст.',
    french: 'Квадрат + Френч — чёткие линии и чистый дизайн для тех, кто ценит безупречность.',
    glitter: 'Квадрат + Сияющий глиттер — дерзкое сочетание строгой формы и игривого блеска!',
  },
  oval: {
    lavender: 'Овал + Нежная Лаванда — мягкость и нежность, будто весенний цветок на кончиках пальцев.',
    nude: 'Овал + Розовый нюд — универсальный выбор: подходит абсолютно ко всему и всегда актуален.',
    bordeaux: 'Овал + Страстный бордо — благородный и женственный образ с характером.',
    french: 'Овал + Френч — нежная классика, которая никогда не выходит из моды.',
    glitter: 'Овал + Сияющий глиттер — романтичное сияние для свидания или долгожданной встречи!',
  },
  stiletto: {
    lavender: 'Стилет + Нежная Лаванда — смелая форма с нежным оттенком: контраст, который покоряет.',
    nude: 'Стилет + Розовый нюд — удлиняет пальцы и добавляет образу изысканности.',
    bordeaux: 'Стилет + Страстный бордо — максимум drama! Для тех, кто не боится быть в центре внимания.',
    french: 'Стилет + Френч — высокая мода на ваших руках: дерзко, стильно, незабываемо.',
    glitter: 'Стилет + Сияющий глиттер — королевский блеск! Идеально для торжества или фотосессии.',
  },
};

let currentShape = 'almond';
let currentColor = 'lavender';

function updateMood() {
  nailShape.setAttribute('d', shapes[currentShape]);
  nailShape.setAttribute('fill', colorFills[currentColor]);

  const isGlitter = currentColor === 'glitter';
  nailSparkle.classList.toggle('visible', isGlitter);

  nailPreview.style.transform = 'scale(0.95)';
  setTimeout(() => {
    nailPreview.style.transform = 'scale(1)';
  }, 150);

  moodResult.textContent = advice[currentShape][currentColor];
  moodResult.classList.remove('updated');
  void moodResult.offsetWidth;
  moodResult.classList.add('updated');
}

document.querySelectorAll('.shape-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.shape-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentShape = btn.dataset.shape;
    updateMood();
  });
});

document.querySelectorAll('.color-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.color-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentColor = btn.dataset.color;
    updateMood();
  });
});

nailPreview.style.transition = 'transform 0.3s ease';
updateMood();

// ── Gallery lightbox ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ── Toast ──
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
let toastTimeout;

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 5000);
}

// ── Booking form ──
const bookingForm = document.getElementById('booking-form');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const submitLoader = document.getElementById('submit-loader');

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitText.classList.add('hidden');
  submitLoader.classList.remove('hidden');

  const formData = new FormData(bookingForm);
  const data = new URLSearchParams(formData);
  const clientName = formData.get('name');

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: data,
    mode: 'no-cors',
  })
    .then(() => {
      showToast(
        `Спасибо, ${clientName}! Олеся свяжется с вами в ближайшее время для подтверждения записи 💜`
      );
      bookingForm.reset();
    })
    .catch(() => {
      showToast('Не удалось отправить заявку. Проверьте интернет и попробуйте снова или напишите в Telegram @n0ranara.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      submitLoader.classList.add('hidden');
    });
});

// ── FAQ Accordion ──
document.querySelectorAll('.accordion-item').forEach((item) => {
  const trigger = item.querySelector('.accordion-trigger');

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
    }
  });
});

// ── Smooth anchor offset for fixed header ──
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    e.preventDefault();
    const target = document.querySelector(id);
    if (target) {
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

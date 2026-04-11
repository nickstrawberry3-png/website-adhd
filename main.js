// Navbar: transparent → solid on scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Fade-in sections on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .about-text, .about-photo').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ===== BILINGUAL TOGGLE =====
const translations = {
  en: {
    'nav-about': 'About',
    'nav-services': 'Services',
    'nav-contact': 'Contact',
    'hero-eyebrow': 'Physician · Coach · ADHD Advocate',
    'hero-h1': 'Doctor. <span>ADHD.</span><br>Life Coach.',
    'hero-sub': "I know what it's like to live with ADHD — the chaos, the brilliance, the frustration. I've turned it into my greatest asset. Let me help you do the same.",
    'hero-cta1': 'Work With Me',
    'hero-cta2': 'Learn More',
    'hero-scroll': 'Scroll',
    'about-label': 'About',
    'about-title': "I've been in your shoes.",
    'about-p1': "I'm <strong>Dr. Nick</strong> — a practicing physician and certified life coach who was diagnosed with ADHD later in life. For years, I fought my brain. I tried to fit into systems that weren't designed for the way my mind works.",
    'about-p2': "Then something shifted. I stopped treating ADHD as a deficit and started seeing it as a different operating system. One built for creativity, urgency, and out-of-the-box thinking.",
    'about-p3': "Now I combine my medical background with coaching frameworks to help <strong>professionals, students, and creatives</strong> with ADHD build lives that work with their neurology — not against it.",
    'stat-1': 'Years in Medicine',
    'stat-2': 'Clients Coached',
    'stat-3': 'Lived Experience',
    'services-label': 'Services',
    'services-title': 'How I Can Help',
    's1-title': '1:1 Coaching',
    's1-body': "Personalized sessions tailored to your brain, your goals, and your life. We'll build systems that actually stick — no generic productivity hacks.",
    's2-title': 'ADHD Strategy Sessions',
    's2-body': 'Deep-dive intensives focused on a specific challenge — time blindness, task initiation, emotional regulation, or career pivots.',
    's3-title': 'Group Programs',
    's3-body': "Community-based coaching for those who thrive with accountability and shared experience. ADHD is less lonely when you're not in it alone.",
    'contact-label': 'Contact',
    'contact-title': 'Ready to Get Unstuck?',
    'contact-tagline': "Whether you're curious, skeptical, or just really tired of fighting your own brain — reach out. First conversation is on me.",
    'contact-cta': 'Book a Free Call',
    'footer': '© 2026 <span>Dr. Nick</span>. All rights reserved.',
  },
  zh: {
    'nav-about': '關於我',
    'nav-services': '服務',
    'nav-contact': '聯絡',
    'hero-eyebrow': '醫生 · 教練 · ADHD 倡導者',
    'hero-h1': '醫生。<span>ADHD。</span><br>生活教練。',
    'hero-sub': '我知道帶著 ADHD 生活是什麼感覺——那種混亂、那種才華、還有那種挫折。我把它變成了我最強的武器，讓我也幫你做到同樣的事。',
    'hero-cta1': '跟我合作',
    'hero-cta2': '了解更多',
    'hero-scroll': '往下滑',
    'about-label': '關於我',
    'about-title': '我懂你的感受。',
    'about-p1': '我是 <strong>Dr. Nick</strong>——一位執業醫生，也是認證生活教練，在人生比較後期才被診斷出有 ADHD。好多年來，我一直跟自己的大腦對抗，試著去配合那些根本不是為我設計的系統。',
    'about-p2': '後來有些事情改變了。我不再把 ADHD 當成缺陷，而是開始把它看成一個不同的操作系統——一個為創意、緊迫感和跳脫框架的思維而生的系統。',
    'about-p3': '現在我把醫學背景結合教練框架，幫助有 ADHD 的<strong>專業人士、學生和創意工作者</strong>，打造一個配合自己神經特質的生活，而不是跟它對抗。',
    'stat-1': '行醫年資',
    'stat-2': '輔導客戶數',
    'stat-3': '親身經歷',
    'services-label': '服務',
    'services-title': '我能怎麼幫你',
    's1-title': '一對一教練',
    's1-body': '完全客製化的課程，針對你的大腦、你的目標和你的生活量身打造。我們會建立真正有效的系統——不是那種套路式的生產力技巧。',
    's2-title': 'ADHD 策略諮詢',
    's2-body': '針對特定挑戰的深度密集課程——時間感消失、啟動任務困難、情緒調節，或是職涯轉換。',
    's3-title': '團體課程',
    's3-body': '以社群為基礎的教練課程，適合需要相互監督和共同經歷的人。有 ADHD 其實不孤單，因為你不是一個人在面對。',
    'contact-label': '聯絡',
    'contact-title': '準備好突破了嗎？',
    'contact-tagline': '不管你是好奇、半信半疑，還是真的累了跟自己的大腦對抗——都可以聯絡我。第一次對話我請客。',
    'contact-cta': '預約免費通話',
    'footer': '© 2026 <span>Dr. Nick</span>. 版權所有。',
  }
};

let currentLang = 'en';

function applyLanguage(lang) {
  const t = translations[lang];

  // Plain text elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // HTML elements (with bold/spans inside)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Elements that need innerHTML (about paragraphs, footer)
  ['about-p1', 'about-p2', 'about-p3', 'footer'].forEach(key => {
    const el = document.querySelector(`[data-i18n="${key}"]`);
    if (el && t[key] !== undefined) el.innerHTML = t[key];
  });

  document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  document.getElementById('langToggle').textContent = lang === 'zh' ? 'EN' : '中文';
  currentLang = lang;
}

document.getElementById('langToggle').addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'zh' : 'en');
});
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
    'hero-eyebrow': 'Medical Doctor · Coach · ADHD Advocate',
    'hero-h1': 'Stuck. <span>Unfocused.</span><br>Capable of More.',
    'hero-sub': "I'm Dr. Nick: a doctor who left medicine and built a life on his own terms. Now I help others do the same. Come have a chat with me, 1st call completely free!",
    'hero-cta1': 'Work With Me',
    'hero-cta2': 'Learn More',
    'hero-scroll': 'Scroll',
    'about-label': 'About',
    'about-title': "I've been in your shoes.",
    'about-p1': "I spent years feeling like I was failing at something my peers found easy. In medical school I couldn't concentrate in lectures, struggled to retain what my peers memorised overnight, and got criticised constantly in clinical rotations. I kept thinking: I know I'm capable. So why does everything feel this hard?",
    'about-p2': "At 26, I was diagnosed with ADHD. It didn't fix everything, but it changed how I saw myself. I stopped trying to force my brain into systems built for other people, and started figuring out what actually worked for me. That meant leaving medicine, leaning into what I'm genuinely good at: connecting with people, communicating, coaching, and building a life with real autonomy.",
    'about-p3': "I'm not a productivity guru. I'm someone who's been genuinely lost, figured out a way through, and now helps others do the same.",
    'stat-1-label': 'Degrees',
    'stat-1-value': 'MBChB Medicine<br>Medical Sciences · Edinburgh',
    'stat-2-label': 'ADHD',
    'stat-2-value': 'Diagnosed Age 26',
    'stat-3-label': 'Languages',
    'stat-3-value': 'English<br>Chinese<br>French<br>Cantonese<br>Taiwanese',
    'stat-4-label': 'Based',
    'stat-4-value': 'Taipei',
    'services-label': 'Services',
    'services-title': 'How I Can Help',
    's1-title': '1:1 Coaching',
    's1-body': "Whether you have ADHD, struggle with focus and discipline, or feel stuck in a life that doesn't quite fit, this is for you. We work together to understand how your brain works and build habits and systems that last. Honest, personalised coaching from someone who's been there.",
    's2-title': 'Workshops & Talks',
    's2-body': 'Available for schools, universities, and organisations. Topics include ADHD awareness, focus and productivity, confidence, and navigating life transitions. Get in touch to discuss.',
    'contact-label': 'Contact',
    'contact-title': 'Ready to Get Unstuck?',
    'contact-tagline': "Whether you're curious, skeptical, or just tired of feeling like you're not living up to your potential, please reach out :) First conversation is free so no pressure.",
    'contact-cta': 'Book a Free Call',
    'footer': '© 2026 <span>Dr. Nick</span>. All rights reserved.',
  },
  zh: {
    'nav-about': '關於我',
    'nav-services': '服務',
    'nav-contact': '聯絡',
    'hero-eyebrow': '醫生 · 教練 · ADHD 倡導者',
    'hero-h1': '卡住了，<span>分心，</span><br>你能做到更多',
    'hero-sub': '我是 Dr. Nick：一個離開醫學、靠自己方式建立生活的醫生。現在我幫助其他人做同樣的事。來跟我聊聊吧，第一次通話完全免費！',
    'hero-cta1': '跟我合作',
    'hero-cta2': '了解更多',
    'hero-scroll': '往下滑',
    'about-label': '關於我',
    'about-title': '我懂你的感受',
    'about-p1': '我花了好多年感覺自己在一件別人輕鬆就能做到的事情上不斷失敗。在醫學院，我沒辦法在課堂上專心，同學一晚就能背起來的東西我怎麼也記不住，臨床實習期間也一直被批評。我心裡一直想：我知道自己有能力，但為什麼每件事都這麼難？',
    'about-p2': '26 歲那年，我被診斷出有 ADHD。這沒有解決所有問題，但改變了我看待自己的方式。我不再硬逼自己去適應那些為別人設計的系統，而是開始找出真正適合我的方法。這意味著離開醫學，轉而投入我真正擅長的事：跟人連結、溝通、教練，還有建立一個真正有自主性的生活。',
    'about-p3': '我不是什麼生產力大師。我只是一個曾經真的迷失過、找到了自己的路，然後現在幫助其他人做同樣事情的人。',
    'stat-1-label': '學歷',
    'stat-1-value': 'MBChB 醫學學位<br>醫學科學 · 愛丁堡大學',
    'stat-2-label': 'ADHD',
    'stat-2-value': '26 歲確診',
    'stat-3-label': '語言',
    'stat-3-value': '英語<br>中文<br>法語<br>廣東話<br>台語',
    'stat-4-label': '居住地',
    'stat-4-value': '台北',
    'services-label': '服務',
    'services-title': '我能怎麼幫你',
    's1-title': '一對一教練',
    's1-body': '不管你有沒有 ADHD，只要你在專注、自律上有困難，或感覺自己困在一個不太對的生活裡，這就是為你設計的。我們一起了解你的大腦是怎麼運作的，建立真正能持續下去的習慣和系統。來自一個真的走過同樣路的人，直接、有針對性的教練。',
    's2-title': '工作坊與演講',
    's2-body': '適合學校、大學和各類機構。主題包括 ADHD 認知、專注力與生產力、自信心，以及人生轉換期的應對。歡迎聯絡討論。',
    'contact-label': '聯絡',
    'contact-title': '準備好突破了嗎',
    'contact-tagline': '不管你是好奇、半信半疑，還是只是累了、覺得自己沒有發揮出應有的潛力，都歡迎聯絡我 :) 第一次對話免費，不用有壓力。',
    'contact-cta': '預約免費通話',
    'footer': '© 2026 <span>Dr. Nick</span>. 版權所有。',
  }
};

let currentLang = 'en';

function applyLanguage(lang) {
  const t = translations[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
  document.getElementById('langToggle').textContent = lang === 'zh' ? 'EN' : '中文';
  currentLang = lang;
}

document.getElementById('langToggle').addEventListener('click', () => {
  applyLanguage(currentLang === 'en' ? 'zh' : 'en');
});
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const themeText = document.querySelector('.theme-text');
const root = document.documentElement;

function setTheme(theme) {
  const isDark = theme === 'dark';
  root.dataset.theme = theme;
  themeIcon.textContent = isDark ? '☾' : '☀';
  themeText.textContent = isDark ? '夜间' : '白天';
  themeToggle.setAttribute('aria-label', isDark ? '切换至白天模式' : '切换至黑夜模式');
  themeToggle.setAttribute('aria-pressed', String(isDark));
}

setTheme(localStorage.getItem('panini-theme') || 'dark');

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('panini-theme', nextTheme);
  setTheme(nextTheme);
});

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

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

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const navIndicator = document.querySelector('.nav-indicator');
const navSections = navLinks
  .map((link) => {
    const targetId = link.getAttribute('href').slice(1);
    const section = targetId === 'top' ? document.querySelector('.hero') : document.querySelector(`#${targetId}`);
    if (section) section.dataset.navId = targetId;
    return section;
  })
  .filter(Boolean);

function setActiveNavigation(currentId) {
  const activeLink = navLinks.find((link) => link.getAttribute('href') === `#${currentId}`) || navLinks[0];
  navLinks.forEach((link) => link.classList.toggle('active', link === activeLink));
  if (navIndicator && activeLink) {
    navIndicator.style.width = `${activeLink.offsetWidth}px`;
    navIndicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
    navIndicator.classList.add('ready');
  }
}

setActiveNavigation(navLinks[0]?.getAttribute('href')?.slice(1));
window.addEventListener('resize', () => {
  const activeLink = navLinks.find((link) => link.classList.contains('active'));
  if (activeLink) setActiveNavigation(activeLink.getAttribute('href').slice(1));
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (!visible.length) return;
    const currentTarget = visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target;
    const currentId = currentTarget.dataset.navId || currentTarget.id;
    setActiveNavigation(currentId);
  },
  { rootMargin: '-20% 0px -62% 0px', threshold: [0.05, 0.2, 0.5] },
);

navSections.forEach((section) => sectionObserver.observe(section));

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

const payButton = document.querySelector('.go-pay');
const purchaseDialog = document.querySelector('.purchase-dialog');
const dialogClose = document.querySelector('.dialog-close');

payButton?.addEventListener('click', () => purchaseDialog?.showModal());

dialogClose?.addEventListener('click', () => purchaseDialog?.close());
purchaseDialog?.addEventListener('click', (event) => {
  if (event.target === purchaseDialog) purchaseDialog.close();
});

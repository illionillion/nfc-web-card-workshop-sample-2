const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const previousButton = document.querySelector('.previous');
const nextButton = document.querySelector('.next');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlide = 0;
let autoAdvance;

const updateThemeButton = (isDark) => {
	themeToggle.setAttribute('aria-pressed', String(isDark));
	themeToggle.setAttribute('aria-label', isDark ? 'ライトテーマに切り替える' : 'ダークテーマに切り替える');
	themeToggle.firstElementChild.textContent = isDark ? 'Light' : 'Theme';
};

const setTheme = (theme) => {
	const isDark = theme === 'dark';
	root.dataset.theme = theme;
	localStorage.setItem('web-card-theme', theme);
	updateThemeButton(isDark);
};

const savedTheme = localStorage.getItem('web-card-theme');
setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
	setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

const showSlide = (index) => {
	activeSlide = (index + slides.length) % slides.length;
	slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === activeSlide));
	dots.forEach((dot, dotIndex) => {
		const isActive = dotIndex === activeSlide;
		dot.classList.toggle('is-active', isActive);
		dot.setAttribute('aria-selected', String(isActive));
	});
};

const restartAutoAdvance = () => {
	window.clearInterval(autoAdvance);
	if (!reducedMotion.matches) {
		autoAdvance = window.setInterval(() => showSlide(activeSlide + 1), 5000);
	}
};

previousButton.addEventListener('click', () => {
	showSlide(activeSlide - 1);
	restartAutoAdvance();
});
nextButton.addEventListener('click', () => {
	showSlide(activeSlide + 1);
	restartAutoAdvance();
});
dots.forEach((dot, index) => dot.addEventListener('click', () => {
	showSlide(index);
	restartAutoAdvance();
}));
reducedMotion.addEventListener('change', restartAutoAdvance);
restartAutoAdvance();

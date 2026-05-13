export function initScrollEffects() {
  window.addEventListener('scroll', () => {
    document.querySelector('.navbar-custom')?.classList.toggle('scrolled', scrollY > 20);
  });
}

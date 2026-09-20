(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-nav');
  const setMenu = open => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    menu.hidden = !open;
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
  });
  matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  navLinks.forEach(link => { const target = document.querySelector(link.hash); if (target) sectionObserver.observe(target); });
  const copyButtons = [...document.querySelectorAll('.copy-button')];
  copyButtons.forEach(button => {
    const defaultLabel = button.textContent;
    const defaultAriaLabel = button.getAttribute('aria-label');
    button.addEventListener('click', async () => {
      const value = button.dataset.copy;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          const input = document.createElement('textarea');
          input.value = value;
          input.setAttribute('readonly', '');
          input.style.position = 'fixed';
          input.style.opacity = '0';
          document.body.append(input);
          input.select();
          const copied = document.execCommand('copy');
          input.remove();
          if (!copied) throw new Error('Copy command failed');
        }
        button.textContent = '已复制';
        button.setAttribute('aria-label', `${defaultAriaLabel}成功`);
      } catch {
        button.textContent = '复制失败';
        button.setAttribute('aria-label', `${defaultAriaLabel}失败`);
      }
      window.setTimeout(() => {
        button.textContent = defaultLabel;
        button.setAttribute('aria-label', defaultAriaLabel);
      }, 1800);
    });
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();

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
  document.getElementById('year').textContent = new Date().getFullYear();

  const intro = '你好，我是 Alex，优先寻找医学 AI 软件开发岗位，也关注企业业务自动化顾问、AI Agent 和游戏开发机会。具备解剖学、影像学知识，以及 TensorFlow、C++、Python、Go、Unity、Cocos、Flutter 等技术能力。项目经验覆盖游戏引擎、低代码平台、自研脚本语言、图像视频处理、识图模型、服务器与多平台应用。期待交流岗位需求和具体业务问题。';
  const status = document.getElementById('action-status');
  document.getElementById('copy-intro').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(intro);
      status.textContent = '求职简介已复制，可以粘贴到消息或邮件中。';
    } catch {
      status.textContent = '自动复制不可用，请选中下方文字复制。';
      let text = document.getElementById('copy-fallback');
      if (!text) {
        text = document.createElement('textarea'); text.id = 'copy-fallback'; text.readOnly = true;
        text.setAttribute('aria-label', '求职简介，可手动复制');
        text.style.cssText = 'width:100%;min-height:150px;margin-top:12px;padding:12px;border:1px solid #8eaa79;border-radius:4px;background:#f0f7e7;color:#24371e;font-family:inherit;font-size:12px;line-height:1.8;';
        status.after(text);
      }
      text.value = intro; text.focus(); text.select();
    }
  });
  document.getElementById('print-profile').addEventListener('click', () => window.print());
})();

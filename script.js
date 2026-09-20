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

  const intro = '你好，我是周永强 Alex，重点寻找医学影像程序开发、AI 应用与自动化工具开发机会。曾任 Nuat Computer Software LLC CTO，具备独立产品研发、游戏引擎、跨平台客户端与服务端经验。项目包括 AutoAct、Window Fusion、数十个休闲游戏、低代码游戏开发平台、社交应用和数据分析系统。技术涵盖 C++、Python、Go、TensorFlow、Unity、Cocos、Flutter、DirectX 与 OpenGL，也有 ASO 和移动游戏推广经验。持续积累解剖学与影像学知识，希望将图形、模型与软件工程经验用于医学影像工具。期待交流具体岗位与业务需求。';
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

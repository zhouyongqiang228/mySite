// A dependency-free 3D projection. Edit these groups and skills to grow the tree.
(() => {
  const root = document.querySelector('.skill-tree');
  if (!root) return;
  const groups = [
    { id: 'code', name: '基础编程', en: 'FOUNDATIONS', color: '#b7f5c9', position: [-95, -55, 30], description: '从语言、内存到程序结构，构建其他技术领域的共同基础。' },
    { id: 'product', name: '产品研发', en: 'PRODUCT ENGINEERING', color: '#e2c89a', position: [-195, 75, -30], description: '连接客户端与服务端，把想法组织成可使用、可持续迭代的产品。' },
    { id: 'graphics', name: '游戏与图形', en: 'REALTIME & GRAPHICS', color: '#b4adff', position: [180, 45, 25], description: '让代码成为可看见、可交互的实时体验。' },
    { id: 'ai', name: '人工智能', en: 'ARTIFICIAL INTELLIGENCE', color: '#ff9c7f', position: [125, 180, -45], description: '将语言模型、知识检索与工具调用连接到实际应用。' },
    { id: 'medical', name: '医学计算', en: 'MEDICAL COMPUTING', color: '#7edbe7', position: [-75, 205, 15], description: '探索医学知识、影像数据与软件技术之间的连接。' },
  ];
  const skills = [
    { id: 'c', name: 'C', group: 'code', position: [-190, -5, 65], description: '贴近计算机底层的编程语言。从指针、内存管理到数据结构，理解程序如何真正运行。', tags: ['底层编程', '内存与数据'] },
    { id: 'cpp', name: 'C++', group: 'code', position: [-105, 25, 100], description: '兼顾抽象能力与运行效率，将底层基础延伸到图形、引擎和高性能软件。', tags: ['系统设计', '性能优化'] },
    { id: 'flutter', name: 'Flutter', group: 'product', position: [-280, 130, 15], description: '用统一的界面体系构建跨平台应用，让产品原型逐步走向完整体验。', tags: ['跨平台', '交互界面'] },
    { id: 'go', name: 'Golang', group: 'product', position: [-240, 200, -60], description: '构建清晰、可靠的后端服务，连接应用、数据与业务逻辑。', tags: ['后端服务', '并发编程'] },
    { id: 'mobile', name: 'iOS / Android', group: 'product', position: [-310, 40, -65], description: '围绕移动设备的交互方式和平台能力，完成从开发到发布的应用体验。', tags: ['移动应用', '产品交付'] },
    { id: 'unity', name: 'Unity', group: 'graphics', position: [285, 95, 30], description: '搭建实时交互场景，将游戏逻辑、空间表达与产品创意组合在一起。', tags: ['实时引擎', '交互开发'] },
    { id: 'cocos', name: 'Cocos', group: 'graphics', position: [290, -15, 65], description: '以轻量的游戏开发工作流，把玩法与创意变成可以体验的作品。', tags: ['游戏开发', '玩法实现'] },
    { id: 'graphics-skill', name: 'Graphics', group: 'graphics', position: [230, 150, -65], description: '从坐标变换到画面呈现，用数学和代码描述一个可交互的视觉世界。', tags: ['图形学', '空间表达'] },
    { id: 'llm', name: 'LLM', group: 'ai', position: [210, 260, -80], description: '围绕语言模型的理解与生成能力，探索自然语言驱动的产品交互。', tags: ['语言模型', 'AI 应用'] },
    { id: 'rag', name: 'RAG', group: 'ai', position: [105, 290, 0], description: '把知识检索接入生成过程，为模型提供与任务相关的上下文。', tags: ['知识检索', '上下文'] },
    { id: 'agents', name: 'AI Agent', group: 'ai', position: [30, 230, 85], description: '连接模型、工具与工作流，让智能能力参与多步骤的实际任务。', tags: ['工具调用', '智能工作流'] },
    { id: 'imaging', name: '医学影像', group: 'medical', position: [-140, 290, 65], description: '探索影像数据、视觉理解与智能工具的交叉点，让软件成为理解人体结构的另一种视角。', tags: ['影像数据', '视觉理解', 'AI × 医学'] },
    { id: 'anatomy', name: '解剖学', group: 'medical', position: [-40, 330, -35], description: '以人体结构知识为线索，探索医学内容的数字化表达和空间呈现。', tags: ['人体结构', '医学知识'] },
  ];
  const trunk = { id: 'root', name: 'ALEX / LAB', position: [0, -180, 0] };
  const nodes = [trunk, ...groups.map(group => ({ ...group, group: group.id, hub: true })), ...skills];
  const byId = new Map(nodes.map(node => [node.id, node]));
  const stage = root.querySelector('.tree-stage');
  const canvas = root.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const nodeLayer = root.querySelector('.tree-nodes');
  const detail = root.querySelector('.tree-detail');
  const motionButton = root.querySelector('.tree-motion');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1, height = 1, angle = 0, tilt = 0, filter = 'all', selected = 'imaging';
  let moving = !reducedMotion.matches, visible = false, raf = 0, lastTime = 0, phase = 0;
  let dragging = null, dragged = false;

  const filters = [{ id: 'all', name: '全部领域', color: '#b7f5c9' }, ...groups];
  filters.forEach(group => {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerHTML = `<i></i>${group.name}`;
    button.style.setProperty('--branch-color', group.color);
    button.setAttribute('aria-pressed', String(group.id === filter));
    button.addEventListener('click', () => {
      filter = group.id;
      root.querySelectorAll('.tree-filters button').forEach((item, i) => item.setAttribute('aria-pressed', String(filters[i].id === filter)));
      if (filter !== 'all') select(filter);
      render();
    });
    root.querySelector('.tree-filters').append(button);
  });

  nodes.forEach(node => {
    const button = document.createElement(node.id === 'root' ? 'span' : 'button');
    button.className = `tree-node${node.hub ? ' tree-node-hub' : ''}${node.id === 'root' ? ' tree-node-root' : ''}`;
    button.textContent = node.name;
    button.style.setProperty('--branch-color', groups.find(group => group.id === node.group)?.color || '#b7f5c9');
    if (node.id !== 'root') {
      button.type = 'button';
      button.setAttribute('aria-label', `查看${node.name}`);
      button.addEventListener('click', event => { if (!dragged || event.detail === 0) select(node.id); });
      button.addEventListener('focus', () => { moving = false; syncMotion(); render(); });
    }
    node.element = button;
    nodeLayer.append(button);
  });

  function select(id) {
    selected = id;
    const node = byId.get(id);
    const group = groups.find(item => item.id === node.group);
    detail.style.setProperty('--branch-color', group.color);
    detail.innerHTML = `<div class="tree-detail-top"><span>SELECTED NODE</span><span>↗</span></div>
      <div class="tree-detail-symbol" aria-hidden="true">${node.group === 'medical' ? '✳' : node.group === 'code' ? '{ }' : node.group === 'graphics' ? '◇' : node.group === 'ai' ? '✦' : '⌘'}</div>
      <p class="tree-detail-category">${group.en}</p><h4>${node.name}</h4><p class="tree-description">${node.description}</p>
      <div class="tree-detail-tags">${(node.tags || skills.filter(skill => skill.group === group.id).map(skill => skill.name)).map(tag => `<span>${tag}</span>`).join('')}</div>
      <div class="tree-detail-path"><span>知识路径</span><p>ALEX / LAB <b>↗</b> ${group.name}${node.hub ? '' : `<b>↗</b> ${node.name}`}</p></div>
      <a class="tree-project-link" href="#proof">看看这些能力的交汇处 <span>↗</span></a>`;
    nodes.forEach(item => { if (item.id !== 'root') item.element.setAttribute('aria-pressed', String(item.id === selected)); });
    render();
  }

  function project([x, y, z]) {
    const rx = x * Math.cos(angle) + z * Math.sin(angle);
    const rz = -x * Math.sin(angle) + z * Math.cos(angle);
    const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
    const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
    const perspective = 1050 / (1050 - depth);
    const scale = Math.min(width / 790, (height - 130) / 560);
    return { x: width / 2 + rx * scale * perspective, y: height * .65 - ry * scale * perspective, scale: perspective, depth };
  }

  const edges = nodes.filter(node => node.id !== 'root').map(node => {
    const parent = node.hub ? trunk : byId.get(node.group);
    return { parent, node, group: node.group, color: groups.find(group => group.id === node.group).color };
  });

  function branchPoint(edge, t, strand = 0) {
    const a = edge.parent.position, b = edge.node.position;
    const ease = t * t * (3 - 2 * t);
    const spread = Math.sin(t * Math.PI) * strand;
    return [a[0] + (b[0] - a[0]) * ease + spread, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * ease + spread * .7];
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    // Perspective rings form the ground beneath the tree.
    [65, 115, 170, 230, 300].forEach(radius => {
      ctx.beginPath();
      for (let i = 0; i <= 100; i++) {
        const a = i / 100 * Math.PI * 2;
        const p = project([Math.cos(a) * radius, -200 + Math.sin(a) * radius * .13, Math.sin(a) * radius]);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(183,245,201,.07)'; ctx.lineWidth = 1; ctx.stroke();
    });
    edges.forEach((edge, index) => {
      const active = filter === 'all' || filter === edge.group;
      const highlighted = selected === edge.node.id || byId.get(selected).group === edge.group;
      const strands = edge.node.hub ? [-7, -3, 0, 3, 7] : [0];
      strands.forEach(strand => {
        ctx.beginPath();
        for (let i = 0; i <= 35; i++) {
          const p = project(branchPoint(edge, i / 35, strand));
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = edge.color;
        ctx.globalAlpha = active ? (highlighted ? .5 : .2) * (strand === 0 ? 1 : .45) : .04;
        ctx.lineWidth = highlighted && strand === 0 ? 1.4 : .7;
        ctx.stroke();
      });
      if (active) {
        const p = project(branchPoint(edge, (phase * .12 + index * .137) % 1));
        ctx.globalAlpha = highlighted ? .95 : .45;
        ctx.fillStyle = edge.color; ctx.shadowColor = edge.color; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(p.x, p.y, highlighted ? 2 : 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
    ctx.globalAlpha = 1;
    nodes.forEach(node => {
      const p = project(node.position);
      const active = node.id === 'root' || filter === 'all' || filter === node.group;
      const compact = width < 520 && filter === 'all' && node.id !== 'root' && !node.hub && node.group !== 'code' && node.id !== selected;
      node.element.hidden = !active || compact;
      node.element.style.left = `${p.x}px`;
      node.element.style.top = `${p.y}px`;
      node.element.style.zIndex = Math.round(300 + p.depth);
      node.element.style.setProperty('--depth-scale', Math.max(.85, Math.min(1.12, p.scale)));
      const color = groups.find(group => group.id === node.group)?.color || '#b7f5c9';
      ctx.globalAlpha = active ? .85 : .1;
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = node.id === selected ? 20 : 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, node.id === 'root' ? 5 : node.hub ? 4 : 2.5, 0, Math.PI * 2); ctx.fill();
      if (node.id === selected) {
        ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.globalAlpha = .4;
        ctx.beginPath(); ctx.arc(p.x, p.y, 10, 0, Math.PI * 2); ctx.stroke();
      }
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }

  function animate(time) {
    raf = 0;
    const dt = lastTime ? Math.min((time - lastTime) / 1000, .05) : 0;
    lastTime = time;
    if (moving && !dragging) {
      phase += dt;
      // A gentle sway preserves readable branch positions; dragging explores the full volume.
      angle += Math.cos(phase * .23) * dt * .015;
    }
    render();
    if (visible && !document.hidden && moving) raf = requestAnimationFrame(animate);
  }
  function schedule() {
    if (!raf && visible && !document.hidden && moving) { lastTime = 0; raf = requestAnimationFrame(animate); }
  }
  function syncMotion() {
    motionButton.textContent = moving ? '暂停转动' : '自动转动';
    motionButton.setAttribute('aria-pressed', String(moving));
    schedule();
  }
  motionButton.addEventListener('click', () => { moving = !moving; syncMotion(); });
  root.querySelector('.tree-reset').addEventListener('click', () => { angle = 0; tilt = 0; phase = 0; render(); });
  stage.addEventListener('pointerdown', event => {
    if (event.target.closest('.tree-toolbar') || event.button !== 0) return;
    dragged = false;
    dragging = { x: event.clientX, y: event.clientY, angle, tilt, id: event.pointerId };
  });
  stage.addEventListener('pointermove', event => {
    if (!dragging || event.pointerId !== dragging.id) return;
    const dx = event.clientX - dragging.x, dy = event.clientY - dragging.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragged = true;
      stage.setPointerCapture(event.pointerId);
      angle = dragging.angle + dx * .005;
      tilt = Math.max(-.22, Math.min(.22, dragging.tilt + dy * .001));
      render();
    }
  });
  function endDrag() { dragging = null; }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('lostpointercapture', endDrag);
  window.addEventListener('pointerup', endDrag);
  const observer = new ResizeObserver(() => {
    width = stage.clientWidth; height = stage.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); render();
  });
  observer.observe(stage);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
    schedule();
  }).observe(stage);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && raf) { cancelAnimationFrame(raf); raf = 0; }
    schedule();
  });
  reducedMotion.addEventListener('change', () => { moving = !reducedMotion.matches; syncMotion(); render(); });
  select(selected); syncMotion();
})();

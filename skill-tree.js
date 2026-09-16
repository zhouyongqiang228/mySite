// One fully expanded botanical tree. Labels never rotate, collapse or disappear.
(() => {
  const root = document.querySelector('.skill-tree');
  const catalog = window.skillCatalog;
  if (!root || !catalog) return;
  const stage = root.querySelector('.tree-stage');
  const canvas = root.querySelector('.tree-canvas');
  const ctx = canvas.getContext('2d');
  const layer = root.querySelector('.tree-nodes');
  const nodes = [], byId = new Map();
  const mint = '#b7f5c9';
  const colors = { medical: '#a1d7c3', ai: '#e5c59d', development: mint };
  function visit(node, parent = null, domain = null) {
    const entry = { ...node, parent: parent?.id || null, domain: parent?.id === 'root' ? node.id : domain, leaf: !node.children?.length };
    entry.color = colors[entry.domain] || mint;
    const label = document.createElement('div');
    label.className = `tree-label ${entry.leaf ? 'tree-leaf' : 'tree-branch'}${node.id === 'root' ? ' tree-root' : ''}`;
    label.dataset.skill = node.id;
    label.setAttribute('role', 'listitem');
    label.style.setProperty('--branch-color', entry.color);
    const name = document.createElement('span');
    name.textContent = node.name; label.append(name);
    const ancestry = [];
    for (let p = parent; p; p = byId.get(p.parent)) ancestry.unshift(p.name);
    label.setAttribute('aria-label', [...ancestry, node.name].join(' / '));
    entry.element = label;
    layer.append(label); nodes.push(entry); byId.set(node.id, entry);
    (node.children || []).forEach(child => visit(child, entry, entry.domain));
  }
  visit(catalog);
  root.querySelector('.tree-count').textContent = `${nodes.filter(node => node.leaf).length} 项技能与经验 · 完整呈现`;
  const development = byId.get('development');
  // Keep whole subbranches together and balance the two sides by leaf count.
  const left = [byId.get('medical')], right = [byId.get('ai')];
  const weight = groups => groups.reduce((total, node) => total + node.children.length + 2, 0);
  [...(development?.children || [])].sort((a, b) => b.children.length - a.children.length).forEach(node => {
    (weight(left) <= weight(right) ? left : right).push(byId.get(node.id));
  });
  let width = 1, height = 1, edges = [], visible = false, frame = 0, time = 0, last = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function place(node, x, y, side, labelX = x, labelY = y) {
    node.x = x; node.y = y;
    node.element.dataset.side = side;
    node.element.style.left = `${labelX}px`; node.element.style.top = `${labelY}px`;
  }
  function layout() {
    width = Math.max(1, stage.clientWidth);
    const narrow = width < 700, row = narrow ? 35 : 32, gap = narrow ? 54 : 76;
    root.dataset.layout = narrow ? 'narrow' : 'wide';
    const measure = groups => groups.reduce((n, group) => n + group.children.length * row + gap, 0);
    const slots = narrow ? [[left[0], right[0], ...(development?.children || []).map(n => byId.get(n.id))]] : [left, right];
    height = Math.max(...slots.map(measure)) + (narrow ? 166 : 182);
    stage.style.height = `${height}px`;
    const center = width / 2, rootX = narrow ? 29 : center;
    place(byId.get('root'), rootX, height - 92, narrow ? 'mobile-root' : 'center', narrow ? 50 : center, height - 72);
    const devY = narrow ? 2 * gap + (left[0].children.length + right[0].children.length) * row + 25 : height - 215;
    place(development, rootX, devY, narrow ? 'mobile-branch' : 'center', narrow ? 48 : center, narrow ? devY - 16 : devY - 24);
    slots.forEach((groups, column) => {
      let y = narrow ? 76 : 58;
      groups.forEach(group => {
        const side = narrow ? 'right' : column ? 'right' : 'left', sign = column ? 1 : -1;
        const hubX = narrow ? 70 : center + sign * width * .145;
        const leafX = narrow ? 98 : column ? width - Math.min(215, width * .255) : Math.min(215, width * .255);
        const firstY = y;
        group.children.forEach((child, index) => place(byId.get(child.id), leafX, y + index * row, side));
        const middleY = firstY + (group.children.length - 1) * row / 2;
        place(group, hubX, narrow ? firstY - 25 : middleY, narrow ? 'mobile-branch' : 'center', narrow ? hubX + 8 : hubX, narrow ? firstY - 27 : middleY - 24);
        y += group.children.length * row + gap;
      });
    });
    edges = nodes.filter(node => node.parent).map(node => {
      const parent = byId.get(node.parent);
      const start = { x: parent.x, y: parent.y }, end = { x: node.x, y: node.y }, delta = end.x - start.x;
      return { start, end, c1: { x: start.x + delta * .22, y: start.y }, c2: { x: start.x + delta * .55, y: end.y }, color: node.color, trunk: !node.leaf };
    });
    if (ctx) {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
    }
  }
  function point(edge, t) {
    const u = 1 - t;
    return {
      x: u ** 3 * edge.start.x + 3 * u * u * t * edge.c1.x + 3 * u * t * t * edge.c2.x + t ** 3 * edge.end.x,
      y: u ** 3 * edge.start.y + 3 * u * u * t * edge.c1.y + 3 * u * t * t * edge.c2.y + t ** 3 * edge.end.y,
    };
  }
  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const origin = byId.get('root');
    ctx.strokeStyle = mint; ctx.lineWidth = 1;
    // Flattened rings keep the original botanical tree's spatial grounding.
    if (width >= 700) for (const radius of [48, 88, 140, 198]) {
      ctx.globalAlpha = .055; ctx.beginPath();
      ctx.ellipse(origin.x, height - 40, radius, radius * .095, 0, 0, Math.PI * 2); ctx.stroke();
    }
    edges.forEach((edge, index) => {
      ctx.beginPath(); ctx.moveTo(edge.start.x, edge.start.y);
      ctx.bezierCurveTo(edge.c1.x, edge.c1.y, edge.c2.x, edge.c2.y, edge.end.x, edge.end.y);
      ctx.strokeStyle = edge.color; ctx.globalAlpha = edge.trunk ? .3 : .22; ctx.lineWidth = edge.trunk ? 1.5 : .8; ctx.stroke();
      const p = point(edge, (time * .055 + index * .173) % 1);
      ctx.globalAlpha = edge.trunk ? .65 : .4; ctx.shadowColor = edge.color; ctx.shadowBlur = 7;
      ctx.fillStyle = edge.color; ctx.beginPath(); ctx.arc(p.x, p.y, edge.trunk ? 1.8 : 1.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    });
    nodes.forEach(node => {
      ctx.globalAlpha = node.leaf ? .75 : .95; ctx.fillStyle = node.color; ctx.shadowColor = node.color; ctx.shadowBlur = node.leaf ? 6 : 12;
      ctx.beginPath(); ctx.arc(node.x, node.y, node.id === 'root' ? 5 : node.leaf ? 2 : 3.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }
  function animate(timestamp) {
    frame = 0; time += last ? Math.min((timestamp - last) / 1000, .05) : 0;
    last = timestamp; draw(); schedule();
  }
  function schedule() {
    if (ctx && visible && !document.hidden && !reducedMotion.matches && !frame) frame = requestAnimationFrame(animate);
  }
  function syncAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0; schedule();
  }
  new ResizeObserver(layout).observe(stage);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncAnimation(); }).observe(stage);
  document.addEventListener('visibilitychange', syncAnimation);
  reducedMotion.addEventListener('change', () => { syncAnimation(); draw(); });
  layout();
})();

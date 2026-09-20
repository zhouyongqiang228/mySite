// A continuously rotating, perspective-projected sphere of final skill nodes.
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
  function visit(node, ancestors = [], domain = null) {
    const path = [...ancestors, node.name];
    const branch = ancestors.length === 1 ? node.id : domain;
    if (node.id === 'root' || !node.children?.length) {
      const entry = { ...node, parent: node.id === 'root' ? null : 'root', leaf: node.id !== 'root', color: colors[branch] || mint };
      const label = document.createElement('div');
      label.className = `tree-label ${entry.leaf ? 'tree-leaf' : 'tree-root'}`;
      label.dataset.skill = node.id;
      label.setAttribute('role', 'listitem');
      label.style.setProperty('--branch-color', entry.color);
      label.textContent = node.name;
      label.setAttribute('aria-label', path.join(' / '));
      entry.element = label;
      layer.append(label); nodes.push(entry); byId.set(node.id, entry);
    }
    (node.children || []).forEach(child => visit(child, path, branch));
  }
  visit(catalog);
  const leaves = nodes.filter(node => node.leaf);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  leaves.forEach((node, i) => {
    const y = 1 - 2 * (i + .5) / leaves.length;
    const ring = Math.sqrt(1 - y * y), a = i * goldenAngle;
    node.position = [Math.cos(a) * ring, y, Math.sin(a) * ring];
  });
  const normalize = vector => { const length = Math.hypot(...vector) || 1; return vector.map(value => value / length); };
  const mesh = [], connected = new Set();
  leaves.forEach((node, i) => {
    const neighbors = leaves.map((other, j) => ({ j, distance: Math.hypot(...other.position.map((v, k) => v - node.position[k])) }))
      .filter(item => item.j !== i).sort((a, b) => a.distance - b.distance).slice(0, 3);
    neighbors.forEach(({ j }) => {
      const key = [i, j].sort((a, b) => a - b).join(':');
      if (connected.has(key)) return;
      connected.add(key);
      const other = leaves[j];
      mesh.push({ color: node.color, points: Array.from({ length: 13 }, (_, k) => normalize(node.position.map((v, axis) => v + (other.position[axis] - v) * k / 12))) });
    });
  });
  const guides = [];
  for (const latitude of [-.55, 0, .55]) {
    const r = Math.sqrt(1 - latitude * latitude);
    guides.push(Array.from({ length: 81 }, (_, i) => [Math.cos(i / 80 * Math.PI * 2) * r, latitude, Math.sin(i / 80 * Math.PI * 2) * r]));
  }
  for (let meridian = 0; meridian < 4; meridian++) {
    const angle = meridian / 4 * Math.PI;
    guides.push(Array.from({ length: 81 }, (_, i) => {
      const a = i / 80 * Math.PI * 2;
      return [Math.cos(a) * Math.cos(angle), Math.sin(a), Math.cos(a) * Math.sin(angle)];
    }));
  }
  let width = 1, height = 1, radius = 1, visible = false, frame = 0, time = 0, last = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function project([x, y, z]) {
    const angle = time * .15 + .35;
    const rx = x * Math.cos(angle) + z * Math.sin(angle);
    const rz = -x * Math.sin(angle) + z * Math.cos(angle);
    const ry = y * Math.cos(.24) - rz * Math.sin(.24);
    const depth = y * Math.sin(.24) + rz * Math.cos(.24);
    const perspective = 4.5 / (4.5 - depth);
    return { x: width / 2 + rx * radius * perspective, y: height * .47 - ry * radius * perspective, depth, scale: .82 + (depth + 1) * .12 };
  }
  let layoutKey = '';
  function layout() {
    const nextKey = `${stage.clientWidth}:${devicePixelRatio || 1}`;
    if (nextKey === layoutKey) return;
    layoutKey = nextKey;
    width = Math.max(1, stage.clientWidth);
    height = Math.max(width, 390);
    radius = Math.min(width * .355, height * .355);
    root.dataset.layout = width < 540 ? 'narrow' : 'wide';
    stage.style.height = `${height}px`;
    leaves.forEach(node => {
      const font = width < 540 ? 10 : 11;
      const estimated = [...node.name].reduce((n, c) => n + (c.charCodeAt(0) > 255 ? font : font * .75), 12);
      node.labelWidth = Math.min(width < 540 ? 90 : 120, Math.max(38, estimated));
      node.element.style.width = `${node.labelWidth}px`;
      node.labelHeight = node.element.offsetHeight || Math.ceil(estimated / node.labelWidth) * (width < 540 ? 13 : 16) + 4;
      node.element.style.left = '0';
      node.element.style.top = '0';
    });
    // Reserve fixed label margins so no edge clamping can change orbital velocity.
    const maxWidth = Math.max(...leaves.map(node => node.labelWidth));
    const maxHeight = Math.max(...leaves.map(node => node.labelHeight));
    radius = Math.max(1, Math.min(radius, (width - maxWidth - 16) / 2 * .97, (height * .53 - 65 - maxHeight - 9) * .97));
    const center = byId.get('root');
    center.element.style.left = `${width / 2}px`; center.element.style.top = `${height - 36}px`;
    center.element.style.width = '110px';
    if (ctx) {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    draw();
  }
  function drawCurve(points, color, alpha) {
    const projected = points.map(project);
    ctx.strokeStyle = color; ctx.lineWidth = .65;
    for (let i = 1; i < projected.length; i++) {
      const a = projected[i - 1], b = projected[i];
      ctx.globalAlpha = alpha * (.35 + ((a.depth + b.depth) / 2 + 1) * .325);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
  }
  function draw() {
    const projected = leaves.map(node => ({ node, ...project(node.position) }));
    // Stable labels follow their own analytic orbit. Pairwise collision relaxation
    // flips push direction at crossings, causing discontinuous targets and jitter.
    // Keep text at a fixed size; depth is represented by continuous opacity only.
    projected.forEach(p => {
      const x = p.x;
      const y = p.y + 9;
      p.node.label = { x, y };
      const style = p.node.element.style;
      style.transform = `translate3d(${x - p.node.labelWidth / 2}px, ${y}px, 0)`;
      const front = Math.max(0, Math.min(1, (p.depth + .15) / .65));
      style.opacity = String(.12 + .88 * front * front * (3 - 2 * front));
    });
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(width * .45, height * .42, 0, width / 2, height * .47, radius * 1.15);
    glow.addColorStop(0, '#b7f5c90c'); glow.addColorStop(.6, '#73b89008'); glow.addColorStop(1, '#73b89000');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    guides.forEach(points => drawCurve(points, mint, .13));
    mesh.forEach((edge, index) => {
      drawCurve(edge.points, edge.color, .23);
      if (index % 3) return;
      const t = (time * .13 + index * .17) % 1, position = t * (edge.points.length - 1);
      const a = edge.points[Math.floor(position)], b = edge.points[Math.min(edge.points.length - 1, Math.floor(position) + 1)];
      const p = project(normalize(a.map((v, i) => v + (b[i] - v) * (position % 1))));
      ctx.globalAlpha = .25 + (p.depth + 1) * .25;
      ctx.fillStyle = edge.color; ctx.shadowColor = edge.color; ctx.shadowBlur = 7;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.3 * p.scale, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    });
    projected.sort((a, b) => a.depth - b.depth).forEach(p => {
      const label = p.node.label;
      if (Math.hypot(label.x - p.x, label.y - p.y) > 18) {
        ctx.strokeStyle = p.node.color; ctx.globalAlpha = .12;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(label.x, label.y); ctx.stroke();
      }
      ctx.globalAlpha = .35 + (p.depth + 1) * .3; ctx.fillStyle = p.node.color;
      ctx.shadowColor = p.node.color; ctx.shadowBlur = 4 + (p.depth + 1) * 4;
      ctx.beginPath(); ctx.arc(p.x, p.y, 2.2 * p.scale, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  }
  function animate(timestamp) {
    frame = 0; time += last ? Math.min((timestamp - last) / 1000, .05) : 0;
    last = timestamp; draw(); schedule();
  }
  function schedule() {
    if (visible && !document.hidden && !reducedMotion.matches && !frame) frame = requestAnimationFrame(animate);
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
  document.fonts?.ready.then(() => { layoutKey = ''; layout(); });
})();

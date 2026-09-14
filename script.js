const canvas = document.getElementById('network');
const ctx = canvas.getContext('2d');
let points = [];
function resize(){ canvas.width=innerWidth*devicePixelRatio; canvas.height=innerHeight*devicePixelRatio; ctx.scale(devicePixelRatio,devicePixelRatio); points=Array.from({length:Math.min(55,Math.floor(innerWidth/24))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18})); }
function draw(){ const w=innerWidth,h=innerHeight; ctx.clearRect(0,0,w,h); points.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;}); points.forEach((p,i)=>{points.slice(i+1).forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<125){ctx.strokeStyle=`rgba(183,245,201,${(1-d/125)*.14})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}});ctx.fillStyle='rgba(183,245,201,.3)';ctx.fillRect(p.x,p.y,1.5,1.5);});requestAnimationFrame(draw); }
addEventListener('resize',resize); resize(); draw();

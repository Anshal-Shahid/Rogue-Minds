gsap.registerPlugin(ScrollTrigger);
 
const S4_IMAGES = [
  { src: "public/assets/clients/client-metacrafters.jpg", w: 340, h: 460 },

  { src: "public/assets/clients/client-bitget.jpg", w: 280, h: 380 },

  { src: "public/assets/clients/client-breeder.jpg", w: 400, h: 300 },

  { src: "public/assets/clients/client-cmcc.jpg", w: 260, h: 360 },

  { src: "public/assets/clients/client-david-lee.jpg", w: 320, h: 420 },

  { src: "public/assets/clients/client-kairon-logo.jpg", w: 370, h: 260 },

  { src: "public/assets/clients/client-kairon.jpg", w: 290, h: 390 },

  { src: "public/assets/clients/client-mantra-1.jpg", w: 350, h: 240 },

  { src: "public/assets/clients/client-mantra-2.jpg", w: 310, h: 430 },

  { src: "public/assets/clients/client-mantra-3.jpg", w: 380, h: 280 },
];
const S4_ORIGINS = [
  { x: 0.12, y: 0.60 },
  { x: 0.82, y: 0.15 },
  { x: 0.50, y: 0.80 },
  { x: 0.20, y: 0.20 },
  { x: 0.75, y: 0.70 },
  { x: 0.38, y: 0.12 },
  { x: 0.65, y: 0.45 },
  { x: 0.08, y: 0.42 },
  { x: 0.55, y: 0.30 },
  { x: 0.30, y: 0.72 },
];
 
const s4Canvas   = document.getElementById('s4-canvas');
const s4HeadLine = document.getElementById('s4-head-line');
const s4HeadSub  = document.getElementById('s4-head-sub');
const vw = () => window.innerWidth;
const vh = () => window.innerHeight;
 
/* ease helpers */
const s4EaseOut = t => 1 - Math.pow(1 - t, 3);
const s4EaseIn  = t => t * t * t;
 
/* random edge exit vector */
function s4RandomExit() {
  const picks = [
    () => ({ x: gsap.utils.random(-0.3, 0.3), y: -1.4 }),
    () => ({ x: gsap.utils.random(-0.3, 0.3), y:  1.4 }),
    () => ({ x: -1.4, y: gsap.utils.random(-0.3, 0.3) }),
    () => ({ x:  1.4, y: gsap.utils.random(-0.3, 0.3) }),
  ];
  return picks[Math.floor(Math.random() * picks.length)]();
}
 
const s4ExitVectors = S4_IMAGES.map(() => s4RandomExit());
 
/* build cards */
const s4Cards = S4_IMAGES.map((img) => {
  const card  = document.createElement('div');
  card.className = 's4-img-card';
  card.style.width  = img.w + 'px';
  card.style.height = img.h + 'px';
  const image = document.createElement('img');
  image.src = img.src;
  card.appendChild(image);
  s4Canvas.appendChild(card);
  return card;
});
 
function s4Init() {
  ScrollTrigger.getAll().forEach(t => t.kill());
  const section = document.getElementById('s4-gallery');
 
  /* ── image enter / exit ── */
  s4Cards.forEach((card, i) => {
    const ox   = S4_ORIGINS[i].x * vw();
    const oy   = S4_ORIGINS[i].y * vh();
    const left = ox - S4_IMAGES[i].w / 2;
    const top  = oy - S4_IMAGES[i].h / 2;
 
    gsap.set(card, {
      left, top,
      scale: 0, opacity: 0, x: 0, y: 0,
      rotation: gsap.utils.random(-12, 12),
    });
 
    const stagger = i / S4_IMAGES.length;
 
    /* enter: scale up from fixed origin */
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end:   "80% top",
      scrub: 1.4,
      onUpdate(self) {
        const threshold = stagger * 0.55;
        const localP = gsap.utils.clamp(0, 1, (self.progress - threshold) / 0.45);
        const p = s4EaseOut(localP);
        gsap.set(card, { scale: p, opacity: p });
      }
    });
 
    /* exit: fly off at natural size, no scale change, no fade */
    const ev    = s4ExitVectors[i];
    const exitX = ev.x * vw() * 1.8;
    const exitY = ev.y * vh() * 1.8;
 
    ScrollTrigger.create({
      trigger: section,
      start: "72% top",
      end:   "100% top",
      scrub: 1.2,
      onUpdate(self) {
        const threshold = stagger * 0.25;
        const localP = gsap.utils.clamp(0, 1, (self.progress - threshold) / (1 - threshold));
        const p = s4EaseOut(localP);
        gsap.set(card, {
          x:       exitX * p,
          y:       exitY * p,
          scale:   1,
          opacity: 1,
        });
      }
    });
  });
 
  /* ── heading appear (~30–55% of scroll) ── */
  ScrollTrigger.create({
    trigger: section,
    start: "30% top",
    end:   "55% top",
    scrub: 1.6,
    onUpdate(self) {
      const p  = s4EaseOut(gsap.utils.clamp(0, 1, self.progress));
      const p2 = s4EaseOut(gsap.utils.clamp(0, 1, (self.progress - 0.15) / 0.85));
      gsap.set(s4HeadLine, { opacity: p,  y: gsap.utils.interpolate(40, 0, p) });
      gsap.set(s4HeadSub,  { opacity: p2, y: gsap.utils.interpolate(20, 0, p2) });
    }
  });
 
  /* ── heading exit: fires AFTER all images are gone (images finish at 100%) ── */
  ScrollTrigger.create({
    trigger: section,
    start: "92% top",
    end:   "100% top",
    scrub: 0.8,
    onUpdate(self) {
      const p  = s4EaseIn(gsap.utils.clamp(0, 1, self.progress));
      const p2 = s4EaseIn(gsap.utils.clamp(0, 1, Math.min(self.progress * 1.35, 1)));
      gsap.set(s4HeadLine, {
        scaleY:         gsap.utils.interpolate(1, 0, p),
        transformOrigin: "left top",
      });
      gsap.set(s4HeadSub, {
        scaleY:         gsap.utils.interpolate(1, 0, p2),
        transformOrigin: "left top",
      });
    }
  });
}
 
s4Init();
 
let s4ResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(s4ResizeTimer);
  s4ResizeTimer = setTimeout(() => { ScrollTrigger.refresh(); s4Init(); }, 200);
});
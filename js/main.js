/* ═══════════════════════════════════════
   main.js — 양새봄 · UX Planner Portfolio
   모달 + 라이트박스 + Hero 모션
   ═══════════════════════════════════════ */

function openModal(id) {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  const target = document.getElementById('modal-' + id);
  if (target) {
    target.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(id) {
  const target = document.getElementById('modal-' + id);
  if (target) {
    target.classList.remove('open');
    document.body.style.overflow = '';
  }
}

let lbImages = [], lbIndex = 0;
let lb, lbImg, lbCounter;

function openLightbox(imgs, startIndex) {
  lbImages = imgs; lbIndex = startIndex;
  renderLb();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lb.classList.remove('open');
  if (!document.querySelector('.modal-overlay.open')) document.body.style.overflow = '';
}
function renderLb() {
  lbImg.classList.add('fade');
  setTimeout(() => {
    lbImg.src = lbImages[lbIndex];
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
    lbImg.classList.remove('fade');
  }, 120);
}
function lbPrev() { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; renderLb(); }
function lbNext() { lbIndex = (lbIndex + 1) % lbImages.length; renderLb(); }

function countUp(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, step);
}

function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  function createParticles() {
    particles = [];
    const count = Math.floor(W / 18);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.4 + 0.6,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.35 + 0.08
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253,89,86,${p.alpha})`;
      ctx.fill();
      particles.forEach(q => {
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(91,127,166,${0.07*(1-dist/90)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  resize(); createParticles(); draw();
  window.addEventListener('resize', () => { resize(); createParticles(); });
}

document.addEventListener('DOMContentLoaded', () => {

  /* 라이트박스 요소 — DOM 준비 후 참조 */
  lb        = document.getElementById('lightbox');
  lbImg     = document.getElementById('lb-img');
  lbCounter = document.getElementById('lb-counter');

  /* 오버레이 바깥 클릭 → 모달 닫기 */
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* 갤러리 라이트박스 바인딩 */
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const imgs = Array.from(gallery.querySelectorAll('img'));
    const srcs = imgs.map(img => img.src);
    imgs.forEach((img, i) => {
      img.removeAttribute('onclick');
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(srcs, i));
    });
  });

  /* 라이트박스 배경 클릭 닫기 */
  if (lb) lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  /* 키보드 조작 */
  document.addEventListener('keydown', e => {
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lbPrev();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'Escape')     closeLightbox();
  });

  /* 파티클 */
  initParticles();

  /* 카운트업 */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => observer.observe(el));
});

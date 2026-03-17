/* ═══════════════════════════════════════
   main.js — 양새봄 · UX Planner Portfolio
   프로젝트 모달 + 이미지 라이트박스 슬라이더
   ═══════════════════════════════════════ */

/* ─── 프로젝트 모달 ─── */
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

/* ─── 라이트박스 슬라이더 ─── */
let lbImages = [];   // 현재 갤러리 이미지 src 배열
let lbIndex  = 0;    // 현재 보여지는 인덱스

const lb        = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');

function openLightbox(imgs, startIndex) {
  lbImages = imgs;
  lbIndex  = startIndex;
  renderLb();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.classList.remove('open');
  // 모달이 열려 있으면 scroll 복구 안함
  if (!document.querySelector('.modal-overlay.open')) {
    document.body.style.overflow = '';
  }
}

function renderLb() {
  lbImg.classList.add('fade');
  setTimeout(() => {
    lbImg.src = lbImages[lbIndex];
    lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
    lbImg.classList.remove('fade');
  }, 120);
}

function lbPrev() {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  renderLb();
}

function lbNext() {
  lbIndex = (lbIndex + 1) % lbImages.length;
  renderLb();
}

/* ─── 초기화 (DOM 준비 후) ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* 오버레이 바깥 클릭 → 모달 닫기 */
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* 각 .project-gallery 에 슬라이더 바인딩 */
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const imgs = Array.from(gallery.querySelectorAll('img'));
    const srcs = imgs.map(img => img.src);          // 절대 경로로 수집

    imgs.forEach((img, i) => {
      img.removeAttribute('onclick');               // 기존 onclick 제거
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openLightbox(srcs, i));
    });
  });

  /* 라이트박스 배경 클릭 → 닫기 */
  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  /* 키보드 조작 */
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  lbPrev();
    if (e.key === 'ArrowRight') lbNext();
    if (e.key === 'Escape')     closeLightbox();
  });
});

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fade-in').forEach((el) => {
    setTimeout(() => el.classList.add('visible'), 80);
  });

  const toggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const storageKey = 'theme';
  const savedTheme = localStorage.getItem(storageKey);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  let currentTheme = initialTheme;
  let dragging = false;
  let activePointerId = null;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let elementStartX = 0;
  let elementStartY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let velocityX = 0;
  let velocityY = 0;
  let wasDragged = false;
  let animationFrameId = null;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function applyTheme(theme) {
    currentTheme = theme;
    root.setAttribute('data-theme', theme);
    localStorage.setItem(storageKey, theme);

    if (toggle) {
      const icon = toggle.querySelector('.theme-toggle__icon');
      if (icon) {
        icon.style.transform = theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    }
  }

  function setPosition(x, y) {
    if (!toggle) return;

    const maxX = window.innerWidth - toggle.offsetWidth - 12;
    const maxY = window.innerHeight - toggle.offsetHeight - 12;
    const nextX = clamp(x, 12, maxX);
    const nextY = clamp(y, 12, maxY);

    toggle.style.left = `${nextX}px`;
    toggle.style.top = `${nextY}px`;
  }

  function startThrow() {
    if (!toggle || animationFrameId) return;

    const throwLoop = () => {
      const currentX = parseFloat(toggle.style.left || '24px');
      const currentY = parseFloat(toggle.style.top || '24px');

      velocityX *= 0.94;
      velocityY *= 0.94;
      setPosition(currentX + velocityX * 2.2, currentY + velocityY * 2.2);

      if (Math.abs(velocityX) < 0.015 && Math.abs(velocityY) < 0.015) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(throwLoop);
    };

    animationFrameId = requestAnimationFrame(throwLoop);
  }

  applyTheme(initialTheme);

  if (toggle) {
    toggle.style.left = '24px';
    toggle.style.top = '24px';

    toggle.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      dragging = true;
      wasDragged = false;
      activePointerId = event.pointerId;
      toggle.setPointerCapture(event.pointerId);

      const rect = toggle.getBoundingClientRect();
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      elementStartX = rect.left;
      elementStartY = rect.top;
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = performance.now();
      velocityX = 0;
      velocityY = 0;
      toggle.classList.add('dragging');
    });

    toggle.addEventListener('pointermove', (event) => {
      if (!dragging || event.pointerId !== activePointerId) return;

      const deltaX = event.clientX - pointerStartX;
      const deltaY = event.clientY - pointerStartY;
      const now = performance.now();
      const dt = Math.max(16, now - lastTime);

      velocityX = (event.clientX - lastX) / dt * 12;
      velocityY = (event.clientY - lastY) / dt * 12;

      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = now;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        wasDragged = true;
      }

      setPosition(elementStartX + deltaX, elementStartY + deltaY);
    });

    function endDrag(event) {
      if (!dragging || event.pointerId !== activePointerId) return;

      dragging = false;
      toggle.classList.remove('dragging');
      toggle.releasePointerCapture(event.pointerId);

      if (!wasDragged) {
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
      } else {
        startThrow();
      }
    }

    toggle.addEventListener('pointerup', endDrag);
    toggle.addEventListener('pointercancel', endDrag);
  }
});

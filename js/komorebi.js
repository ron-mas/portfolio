(() => {
  const layer = document.querySelector('.komorebi-overlay');
  if (!layer || !layer.animate) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animation;
  let position = 'translate(0vmax, 0vmax)';

  function drift() {
    if (reducedMotion.matches) return;
    const x = (Math.random() * 5 - 2.5).toFixed(3);
    const y = (Math.random() * 5 - 2.5).toFixed(3);
    const next = `translate(${x}vmax, ${y}vmax)`;
    animation = layer.animate(
      [{ transform: position }, { transform: next }],
      { duration: 16000 + Math.random() * 10000, easing: 'ease-in-out', fill: 'forwards' }
    );
    animation.onfinish = () => {
      position = next;
      layer.style.transform = position;
      animation.cancel();
      drift();
    };
    if (document.hidden) animation.pause();
  }

  reducedMotion.addEventListener('change', () => {
    if (animation) {
      position = getComputedStyle(layer).transform;
      layer.style.transform = position;
      animation.cancel();
    }
    if (!reducedMotion.matches) drift();
  });
  document.addEventListener('visibilitychange', () => {
    if (!animation || reducedMotion.matches) return;
    if (document.hidden) animation.pause();
    else animation.play();
  });
  drift();
})();

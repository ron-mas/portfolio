(() => {
  const layers = document.querySelectorAll(".prism-light");
  const random = (min, max) => min + Math.random() * (max - min);
  layers.forEach(layer => {
    if (layer.childElementCount) return;
    const count = window.innerWidth < 600 ? 12 : 20;
    for (let i = 0; i < count; i++) {
      const light = document.createElement("span");
      light.className = "prism-particle";
      const values = {
        "--x": random(2, 94) + "%",
        "--y": random(4, 94) + "%",
        "--width": random(40, 100) + "px",
        "--height": random(10, 24) + "px",
        "--angle": random(-60, 30) + "deg",
        "--duration": random(10, 20) + "s",
        "--delay": -random(0, 20) + "s",
        "--peak": random(.4, .7)
      };
      Object.entries(values).forEach(([key, value]) => light.style.setProperty(key, value));
      layer.appendChild(light);
    }
  });
  const pause = () => document.body.classList.toggle("prism-paused", document.hidden);
  document.addEventListener("visibilitychange", pause);
  pause();
})();


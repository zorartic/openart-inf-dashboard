import { useEffect, useRef } from "react";

const DEFAULT_ACCENT = "201, 168, 76"; // gold

const PLATFORM_ACCENTS = {
  x:  "29, 161, 242",
  ig: "225, 48, 108",
  yt: "255, 50, 50",
};

export default function Particles({ platform }) {
  const ref = useRef(null);
  const accent = PLATFORM_ACCENTS[platform] || DEFAULT_ACCENT;

  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let id, ps = [];
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const count = Math.floor((c.width * c.height) / 20000);
    for (let i = 0; i < count; i++) {
      ps.push({
        x: Math.random() * c.width, y: Math.random() * c.height,
        r: Math.random() * 1.2 + 0.3, dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
        o: Math.random() * 0.35 + 0.05, tinted: Math.random() > 0.65,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0;
        if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.tinted ? `rgba(${accent},${p.o})` : `rgba(255,255,255,${p.o * 0.4})`;
        ctx.fill();
      });
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resize); };
  }, [accent]);
  return <canvas ref={ref} className="particles-canvas" />;
}

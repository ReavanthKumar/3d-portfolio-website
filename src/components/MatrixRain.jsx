import { useEffect, useRef, useState } from "react";

const MatrixRain = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer to pause animation when off-screen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Start when 10% visible
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return; // Pause if not visible

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size to match parent container
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1).map(() => Math.random() * -100);

    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0"; // Green text
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? "1" : "0";
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const intervalId = setInterval(draw, 33); // ~30 FPS

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isVisible]); // Re-run effect when visibility changes

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-3xl"
        style={{ display: "block", background: "#000" }}
      />
    </div>
  );
};

export default MatrixRain;

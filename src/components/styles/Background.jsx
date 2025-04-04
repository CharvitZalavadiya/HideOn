import React, { useEffect, useRef } from "react";
import "./Background.css"; // Import CSS file

export default function Background() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const config = {
      fontSize: 12, // 👈 Kam font size takki ek line me zyada characters aaye
      columns: null,
      drops: [],
      textColor: "#0f0",
      fadeFactor: 0.05,
      characters:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ｱｲｳｴｵカキクケコ漢字仮名/\\|?*+~-_<>[]{}()%$#@!&",
    };

    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      config.columns = Math.floor(canvas.width / config.fontSize);
      config.drops = Array(config.columns).fill(1);
    };

    const getRandomChar = () => {
      return config.characters.charAt(
        Math.floor(Math.random() * config.characters.length)
      );
    };

    class Drop {
      constructor(column) {
        this.column = column;
        this.y = Math.random() * canvas.height;
        this.speed = (config.fontSize + Math.random() * config.fontSize); // 👈 Slow speed
      }
      update() {
        this.y += this.speed * 0.7; // 👈 Rain aur slow ho jayegi
        if (this.y > canvas.height + config.fontSize) {
          this.y = 0;
          this.speed = (config.fontSize + Math.random() * config.fontSize);
        }
      }
    }

    let drops = [];
    const initDrops = () => {
      drops = [];
      for (let i = 0; i < config.columns; i++) {
        drops[i] = new Drop(i);
      }
    };

    const drawMatrix = () => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.font = `${config.fontSize}px monospace`;
      ctx.shadowColor = config.textColor;
      ctx.shadowBlur = 5;

      for (let i = 0; i < drops.length; i++) {
        const text = getRandomChar();
        const x = i * config.fontSize;
        const y = drops[i].y;
        ctx.fillStyle = `rgba(0, 255, 0, ${0.5 + Math.random() * 0.5})`;
        ctx.fillText(text, x, y);
        drops[i].update();
      }

      // 👇 Animation ko slow karne ke liye delay add kiya hai
      setTimeout(() => {
        requestAnimationFrame(drawMatrix);
      }, 50); // 100ms delay (isse aur slow chahiye to 200ms ya 300ms kar sakte ho)
    };

    const handleResize = () => {
      initCanvas();
      initDrops();
    };

    initCanvas();
    initDrops();
    drawMatrix();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ opacity: 0.6 }}>
      <canvas ref={canvasRef} id="matrixCanvas"></canvas>
    </div>
  );
}

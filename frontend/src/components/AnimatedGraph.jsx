import React, { useEffect, useRef } from 'react';

function AnimatedGraph() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const lines = Array(5).fill().map(() => ({
      y: Math.random() * canvas.height,
      speed: Math.random() * 2 + 1,
      amplitude: Math.random() * 50 + 25,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line, index) => {
        ctx.beginPath();
        ctx.moveTo(0, line.y);

        for (let x = 0; x < canvas.width; x += 10) {
          const y = line.y + Math.sin((x + line.speed * Date.now() * 0.01) * 0.01) * line.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `hsl(${index * 60}, 70%, 50%)`;
        ctx.stroke();

        line.y += line.speed * 0.1;
        if (line.y > canvas.height + line.amplitude) line.y = -line.amplitude;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="animated-graph">
      <h2>Network Activity Simulation</h2>
      <canvas ref={canvasRef} style={{ width: '100%', height: '200px' }} />
    </div>
  );
}

export default AnimatedGraph;
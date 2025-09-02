import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import PropTypes from "prop-types";

export default function CelebrationConfetti({
  trigger,
  onComplete,
  width,
  height,
  x,
  y,
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true);

      // Hide confetti after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) {
          onComplete();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!showConfetti) return null;

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={150}
      gravity={0.3}
      initialVelocityY={20}
      initialVelocityX={5}
      wind={0.02}
      friction={0.99}
      colors={[
        "#FF6B6B", // Red
        "#4ECDC4", // Teal
        "#45B7D1", // Blue
        "#96CEB4", // Green
        "#FFEAA7", // Yellow
        "#DDA0DD", // Plum
        "#98D8C8", // Mint
        "#F7DC6F", // Gold
        "#BB8FCE", // Light Purple
        "#85C1E9", // Light Blue
        "#F8C471", // Orange
        "#82E0AA", // Light Green
      ]}
      confettiSource={{
        x: x || width / 2,
        y: y || height / 2,
        w: 10,
        h: 10,
      }}
      drawShape={(ctx) => {
        const shapes = ["circle", "heart", "star", "square"];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        switch (shape) {
          case "heart":
            // Draw heart shape
            ctx.beginPath();
            ctx.moveTo(5, 5);
            ctx.bezierCurveTo(5, 2, 2, 2, 2, 5);
            ctx.bezierCurveTo(2, 8, 5, 11, 5, 11);
            ctx.bezierCurveTo(5, 11, 8, 8, 8, 5);
            ctx.bezierCurveTo(8, 2, 5, 2, 5, 5);
            ctx.fill();
            break;

          case "star":
            // Draw star shape
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = (i * 4 * Math.PI) / 5;
              const x = 5 + 3 * Math.cos(angle);
              const y = 5 + 3 * Math.sin(angle);
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            break;

          case "square":
            // Draw square
            ctx.fillRect(2, 2, 6, 6);
            break;

          default:
            // Draw circle
            ctx.beginPath();
            ctx.arc(5, 5, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
      }}
    />
  );
}

Confetti.propTypes = {
  trigger: PropTypes.bool.isRequired,
  onComplete: PropTypes.func,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
};

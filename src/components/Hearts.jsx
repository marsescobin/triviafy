import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export default function Hearts({ totalLives, remainingLives, onGameOver }) {
  const hasCalledGameOver = useRef(false);

  // Only call onGameOver once when hearts first reach 0
  useEffect(() => {
    if (remainingLives <= 0 && !hasCalledGameOver.current) {
      hasCalledGameOver.current = true;
    }

    // Reset the flag when remainingLives increases (new question)
    if (remainingLives > 0) {
      hasCalledGameOver.current = false;
    }
  }, [remainingLives, onGameOver]);

  return (
    <div className="hearts-container">
      {Array.from({ length: totalLives }, (_, index) => {
        const isAlive = index < remainingLives;
        const isBreaking =
          index === remainingLives - 1 && remainingLives < totalLives;

        return (
          <Heart
            key={index}
            isAlive={isAlive}
            isBreaking={isBreaking}
            delay={index * 0.1}
          />
        );
      })}
    </div>
  );
}

function Heart({ isAlive, isBreaking, delay = 0 }) {
  if (!isAlive && !isBreaking) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="heart-wrapper"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        {isBreaking ? (
          <BreakingHeart />
        ) : (
          <motion.div
            className="heart-full"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            ♥️
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function BreakingHeart() {
  return (
    <motion.div
      className="breaking-heart"
      initial={{ scale: 1, rotate: 0 }}
      animate={{
        x: [-2, 2, -2, 2, -1, 1, 0],
        rotate: [-1, 1, -1, 1, 0],
        transition: { duration: 0.3 },
      }}
    >
      <motion.div
        className="heart-with-crack"
        initial={{ opacity: 1 }}
        animate={{
          opacity: [1, 1, 0.8, 0.6, 0.4, 0.2, 0],
          scale: [1, 1, 1.05, 1.1, 1.15, 1.2, 0],
          rotate: [0, 0, 5, -5, 10, -10, 0],
        }}
        transition={{
          duration: 0.4, // Reduced from 1.2
          times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
          ease: "easeInOut",
        }}
      >
        <div className="heart-crack-overlay">
          ♥️
          <motion.div
            className="crack-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.1,
              ease: "easeOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

Hearts.propTypes = {
  totalLives: PropTypes.number.isRequired,
  remainingLives: PropTypes.number.isRequired,
  onGameOver: PropTypes.func,
};

Heart.propTypes = {
  isAlive: PropTypes.bool.isRequired,
  isBreaking: PropTypes.bool.isRequired,
  delay: PropTypes.number,
};

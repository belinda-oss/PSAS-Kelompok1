import React from 'react';
import { motion } from 'framer-motion';

/**
 * FadeIn component for smooth reveal on scroll
 */
export const FadeIn = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
}) => {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialVector = directions[direction] || directions.up;

  return (
    <motion.div
      initial={{ opacity: 0, ...initialVector }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Container component for staggered children animations
 */
export const StaggerContainer = ({
  children,
  staggerChildren = 0.15,
  delayChildren = 0.1,
  className = '',
  once = true,
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Child item inside a StaggerContainer
 */
export const StaggerItem = ({
  children,
  className = '',
  direction = 'up',
}) => {
  const directions = {
    up: { y: 25, x: 0 },
    down: { y: -25, x: 0 },
    left: { x: 25, y: 0 },
    right: { x: -25, y: 0 },
    none: { x: 0, y: 0 },
  };

  const initialVector = directions[direction] || directions.up;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...initialVector },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1.0],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Hero image slow zoom-out effect
 */
export const HeroImageZoom = ({
  children,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ scale: 1.08 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 1.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Page level transition wrapper
 */
export const PageTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

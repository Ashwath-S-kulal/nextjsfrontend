export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

export const fadeDown = {
  hidden: { opacity: 0, y: -30 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

export const slideLeft = {
  hidden: { opacity: 0, x: 40 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

export const slideRight = {
  hidden: { opacity: 0, x: -40 },
  visible: (custom = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (custom = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: custom * 0.1, ease: [0.16, 1, 0.3, 1] }
  })
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

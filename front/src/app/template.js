'use client';

import { motion } from 'framer-motion';

export default function Template({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.7,
        ease: 'easeOut',
        delay: 0.1, // pequeño retardo para suavizar la entrada
      }}
    >
      {children}
    </motion.main>
  );
}

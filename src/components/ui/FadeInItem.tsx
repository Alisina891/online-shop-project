// src/components/FadeInItem.tsx
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Props {
  children: ReactNode;
  delay?: number; // seconds
  className?: string;
}

export default function FadeInItem({ children, delay = 0, className = '' }: Props) {
  const { ref, inView } = useInView({ threshold: 0.12, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18, scale: 0.995 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

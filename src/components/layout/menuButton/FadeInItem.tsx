// components/FadeInSection.tsx
'use client';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Props {
  children: React.ReactNode;
  delay?: number;
}

export default function FadeInSection({ children , delay = 0 }: Props) {
  const { ref, inView } = useInView({
    threshold: 0.1, 
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 70 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>

  );
}

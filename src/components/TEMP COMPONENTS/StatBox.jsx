'use client';

import { useRef, useEffect, useState } from 'react';
import styles from './StatBox.module.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { label: 'Total AUM', value: 55868, prefix: '$' },
  { label: 'Total Members', value: 26 },
  { label: 'Days Since Inception', value: 295 },
];

function StatBox({ label, value, prefix = '', index }) {
  const boxRef = useRef(null);
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          onEnter: () => {
            if (hasStarted.current) return;
            hasStarted.current = true;
            const startTime = performance.now();
            const duration = 2000;

            const frame = (now) => {
              const elapsed = now - startTime;
              const t = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - t, 3);
              setCount(Math.floor(eased * value));
              if (t < 1) requestAnimationFrame(frame);
            };

            requestAnimationFrame(frame);
          },
        },
      }
    );
  }, [value]);

  return (
    <div ref={boxRef} className={styles.statBox}>
      <div className={styles.statValue}>
        <span className={styles.animatedText}>
          {prefix}{count.toLocaleString()}
        </span>
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

export default function StatBoxSection() {
  return (
    <div className={styles.statContainer}>
      {stats.map((s, i) => (
        <StatBox
          key={i}
          index={i}
          label={s.label}
          value={s.value}
          prefix={s.prefix}
        />
      ))}
    </div>
  );
}

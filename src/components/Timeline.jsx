'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import styles from './Timeline.module.css'

export default function Timeline({ items = [], heading = 'Timeline' }) {
  const ref = useRef(null)

  // Track progress through the entire timeline block
  const { scrollYProgress } = useScroll({
    target: ref,
    // center-on-center gives a smoother/visible travel for the dot
    offset: ['start center', 'end center'],
  })

  // Grow the line from 0 -> 100% height
  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])
  // Move the dot from top to bottom of the sticky column
  const dotY = useTransform(scrollYProgress, [0, 1], ['0%', 'calc(100% - 24px)'])

  return (
    <section ref={ref} className={styles.wrapper}>
      <div className={styles.inner}>
        {/* Left rail: sticky line + moving dot + centered titles */}
        <div className={styles.left}>
          <div className={styles.sticky}>
            <motion.div
              className={styles.line}
              style={{ scaleY: lineScaleY, originY: 0 }}
            />
            <motion.div className={styles.dot} style={{ y: dotY }} />
            <div className={styles.titles}>
              {items.map((it, i) => (
                <div key={i} className={styles.title}>
                  {it.title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: cards (no enter animations so they load immediately) */}
        <div className={styles.right}>
          {heading ? <h2 className={styles.heading}>{heading}</h2> : null}

          {items.map((it, i) => (
            <article key={i} className={styles.card}>
              <div className={styles.mediaWrap}>
                <img src={it.image} alt={it.title} className={styles.image} />
              </div>
              <div className={styles.content}>
                <h3>{it.title}</h3>
                <p>{it.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

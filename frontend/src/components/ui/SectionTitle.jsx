import React from 'react';
import { motion } from 'framer-motion';

/**
 * Editorial section title — Playfair Display, tracking-widest, uppercase.
 * Slides up with a soft reveal when scrolled into view.
 */
export default function SectionTitle({
    children,
    eyebrow,
    align = 'center',
    light = false,
    as = 'h2',
    className = '',
    size = 'text-3xl sm:text-4xl lg:text-5xl'
}) {
    const MotionTag = motion[as] || motion.h2;
    const alignment = align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

    return (
        <div className={`${alignment} mb-10 md:mb-14 ${align === 'center' ? 'flex flex-col items-center' : ''} ${className}`}>
            {eyebrow && (
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase mb-3 block ${
                        light ? 'text-neutral-400' : 'text-nude hover:text-nude-accent'
                    }`}
                >
                    {eyebrow}
                </motion.span>
            )}
            <MotionTag
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: eyebrow ? 0.1 : 0 }}
                className={`font-serif font-normal tracking-widest uppercase leading-tight ${size} ${
                    light ? 'text-white' : 'text-charcoal'
                } ${className}`}
            >
                {children}
            </MotionTag>
        </div>
    );
}
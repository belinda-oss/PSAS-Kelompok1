import React from 'react';
import { motion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: EASE }
    }
};

export const staggerContainer = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.14, delayChildren: 0.08 }
    }
};

export default function Reveal({ children, className = '', delay = 0, as = 'div' }) {
    const MotionTag = motion[as] || motion.div;

    return (
        <MotionTag
            className={className}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE, delay }}
        >
            {children}
        </MotionTag>
    );
}
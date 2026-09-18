import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

const VARIANTS = {
    solid: {
        base: 'bg-charcoal text-white shadow-sm',
        hover: { scale: 1.02, backgroundColor: '#333333' }
    },
    outline: {
        base: 'border border-charcoal text-charcoal',
        hover: { scale: 1.02, backgroundColor: '#333333', color: '#ffffff' }
    },
    light: {
        base: 'bg-white text-charcoal shadow-md',
        hover: { scale: 1.02, backgroundColor: '#d9d9d9' }
    },
    ghost: {
        base: 'border border-white/90 text-white',
        hover: { scale: 1.02, backgroundColor: '#ffffff', color: '#151515' }
    }
};

const BASE_CLASSES =
    'inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 ' +
    'text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none ' +
    'transition-colors duration-300 whitespace-nowrap select-none';

/**
 * Premium CTA button with tactile micro-interactions.
 * - `to`      → internal react-router Link (animated)
 * - `href`    → external anchor (animated)
 * - default   → <button>
 */
export default function ElegantButton({
    children,
    variant = 'solid',
    to,
    href,
    onClick,
    type,
    className = '',
    disabled = false,
    ariaLabel
}) {
    const config = VARIANTS[variant] || VARIANTS.solid;

    const elemProps = {
        whileHover: config.hover,
        whileTap: { scale: 0.95 },
        disabled,
        className: `${BASE_CLASSES} ${config.base} ${className}`,
        'aria-label': ariaLabel
    };

    if (to) {
        return (
            <MotionLink to={to} {...elemProps}>
                {children}
            </MotionLink>
        );
    }

    if (href) {
        return (
            <motion.a href={href} target="_blank" rel="noopener noreferrer" {...elemProps}>
                {children}
            </motion.a>
        );
    }

    return (
        <motion.button type={type || 'button'} onClick={onClick} {...elemProps}>
            {children}
        </motion.button>
    );
}
import React from 'react';

/**
 * Fluid responsive container. Mobile-first: 1 column gutters on mobile,
 * breathing horizontal padding + vertical rhythm on md/lg.
 */
export default function ResponsiveContainer({
    children,
    className = '',
    maxWidth = 'max-w-6xl',
    py = 'py-10 md:py-16 lg:py-24'
}) {
    return (
        <div className={`w-full px-4 md:px-12 lg:px-24 mx-auto ${maxWidth} ${py} ${className}`}>
            {children}
        </div>
    );
}
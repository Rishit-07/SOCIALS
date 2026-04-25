import React, { useState } from 'react';

const DrawOutlineButton = ({ children, href, onClick }) => {
    const [hovered, setHovered] = useState(false);

    const lineStyle = {
        position: 'absolute',
        background: '#ffffff',
        transition: 'all 0.2s ease',
    };

    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                padding: '6px 12px',
                fontSize: '0.9rem',
                color: hovered ? '#ffffff' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'color 0.2s ease',
            }}
        >
            {children}

            {/* TOP */}
            <span
                style={{
                    ...lineStyle,
                    top: 0,
                    left: 0,
                    height: '2px',
                    width: hovered ? '100%' : '0%',
                }}
            />

            {/* RIGHT */}
            <span
                style={{
                    ...lineStyle,
                    top: 0,
                    right: 0,
                    width: '2px',
                    height: hovered ? '100%' : '0%',
                    transitionDelay: '0.1s',
                }}
            />

            {/* BOTTOM */}
            <span
                style={{
                    ...lineStyle,
                    bottom: 0,
                    right: 0,
                    height: '2px',
                    width: hovered ? '100%' : '0%',
                    transitionDelay: '0.2s',
                }}
            />

            {/* LEFT */}
            <span
                style={{
                    ...lineStyle,
                    bottom: 0,
                    left: 0,
                    width: '2px',
                    height: hovered ? '100%' : '0%',
                    transitionDelay: '0.3s',
                }}
            />
        </a>
    );
};

export default DrawOutlineButton;

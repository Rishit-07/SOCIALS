const rows = [ 
    ['CREATE', 'INSPIRE', 'BUILD', 'FOCUS', 'GROW'], 
    ['ACHIEVE', 'DESIGN', 'MOTIVATE', 'BELIEVE', 'ACHIEVE'], 
    ['DISCIPLINE', 'COMMIT', 'CONNECT', 'WIN', 'SOCIAL'], 
    ['EVOLVE', 'STRIVE', 'IMPACT', 'RISE', 'CONSISTENT'], 
    ['ACCOUNTABLE', 'PARTNER', 'PROGRESS', 'SUCCESS', 'LEARN'], 
    ['PERSIST', 'ENERGY', 'MINDSET', 'EXECUTE', 'RISE'], 

];
const FloatingWords = () => {
    return (
        <div
    style={{
        position: 'absolute',
        top: '165px',
        left: 0,
        width: '100%',
        bottom: 0,
        minHeight: '900px',
        overflow: 'hidden',
        zIndex: 2,
        pointerEvents: 'none',
    }}
>
            <style>
                {`
                    @keyframes marqueeLeft {
                        from { transform: translate3d(0,0,0); }
                        to { transform: translate3d(-50%,0,0); }
                    }

                    @keyframes marqueeRight {
                        from { transform: translate3d(-50%,0,0); }
                        to { transform: translate3d(0,0,0); }
                    }
                `}
            </style>

            {rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    style={{
                        borderTop: '1px solid rgba(255,255,255,0.035)',
                        borderBottom: '1px solid rgba(255,255,255,0.035)',
                        padding: '16px 0',
                        marginBottom: '26px',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            width: 'max-content',
                            gap: '46px',
                            animation:
                                rowIndex % 2 === 0
                                    ? `marqueeLeft ${24 + rowIndex * 2}s linear infinite`
                                    : `marqueeRight ${24 + rowIndex * 2}s linear infinite`,
                            willChange: 'transform',
                        }}
                    >
                        {[...row, ...row, ...row, ...row].map((word, i) => (
                            <span
                                key={i}
                                style={{
                                    fontSize: rowIndex % 2 === 0 ? '5.4rem' : '4.9rem',
                                    fontWeight: 900,
                                    fontFamily: 'Impact, Arial Black, sans-serif',
                                    lineHeight: 1,
                                    letterSpacing: '-2px',
                                    textTransform: 'uppercase',
                                    color: i % 2 === 0 ? 'rgba(255,255,255,0.70)' : 'transparent',
                                    WebkitTextStroke:
                                        i % 2 !== 0 ? '1px rgba(255,255,255,0.09)' : '0px',
                                    flexShrink: 0,
                                    transform: 'translateZ(0)',
                                }}
                            >
                                {word}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FloatingWords;
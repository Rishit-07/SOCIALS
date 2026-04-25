import React, { useState } from 'react';
import Particles from '../components/Particles';
import TextType from '../components/TextType';
import RippleButton from '../components/RippleButton';

const Landing = () => {
    const [showSecondLine, setShowSecondLine] = useState(false);
    const [loopCount, setLoopCount] = useState(0);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                background: '#0f1419',
            }}
        >
            {/* Particles */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                }}
            >
                <Particles
                    particleCount={250}
                    particleSpread={15}
                    speed={0.05}
                    particleColors={['#ffffff', '#f3f4f6', '#e5e7eb']}
                    moveParticlesOnHover={true}
                    particleHoverFactor={2.5}
                    alphaParticles={true}
                    particleBaseSize={150}
                    sizeRandomness={1.2}
                />
            </div>

            {/* Content */}
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* 🔥 Glass Navbar */}
                <nav
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '1.5rem 2rem',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '999px',
                            width: 'min(900px, 100%)',

                            background:
                                'linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',

                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                            color: '#fff',
                        }}
                    >
                        {/* Logo */}
                        <div
                            style={{
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            Socials
                        </div>

                        {/* Links */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '1.2rem',
                                alignItems: 'center',
                            }}
                        >
                            
                            <a href="#about" className="nav-link">
                                About
                            </a>
                            <a href="/login" className="nav-link">
                                Sign In
                            </a>

                            {/* ✨ Animated Button */}
                            <RippleButton
                                as="a"
                                href="/register"
                                rippleColor="#ef4444"
                                style={{
                                    padding: '6px 12px',
                                    fontSize: '0.9rem',
                                    color: 'rgba(255,255,255,0.9)',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    borderRadius: '8px',
                                    background: 'rgba(239,68,68,0.2)',
                                    border: '1px solid rgba(239,68,68,0.45)',
                                }}
                            >
                                Sign Up
                            </RippleButton>
                        </div>
                    </div>
                </nav>

                {/* Center Content */}
                <div
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '2rem',
                        transform: 'translateY(-24px)',
                    }}
                >
                    <TextType
                        key={loopCount}
                        text="Welcome to Socials.!!"
                        typingSpeed={42}
                        deletingSpeed={34}
                        pauseDuration={2400}
                        className="landing-hero-copy landing-hero-title"
                        showCursor={true}
                        cursorCharacter="|"
                        loop={false}
                        highlightWords={["Socials.!!"]}
                        deleteOnComplete={true}
                        onDeleteComplete={() => {
                            setShowSecondLine(true);
                        }}
                    />

                    {showSecondLine && (
                        <TextType
                            as="p"
                            text="Compete in challenges, connect with others, and unlock rewards."
                            typingSpeed={32}
                            deletingSpeed={42}
                            pauseDuration={2400}
                            className="landing-hero-copy landing-hero-subtitle"
                            showCursor={true}
                            cursorCharacter="|"
                            loop={false}
                            deleteOnComplete={true}
                            onDeleteComplete={() => {
                                setShowSecondLine(false);
                                setLoopCount(prev => prev + 1);
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Nav link styles */}
            <style>
                {`
                .nav-link {
                    color: rgba(255,255,255,0.6);
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: color 0.2s ease;
                }
                .nav-link:hover {
                    color: white;
                }

                .landing-hero-copy {
                    color: #e5e7eb;
                    line-height: 1.12;
                    max-width: 900px;
                    margin-top: 1rem;
                }

                .landing-hero-title {
                    font-size: 3rem;
                    font-weight: bold;
                    color: #fff;
                }

                .landing-hero-subtitle {
                    font-size: 1.25rem;
                    font-weight: 400;
                    color: #fff;
                }
                `}
            </style>
        </div>
    );
};

export default Landing;
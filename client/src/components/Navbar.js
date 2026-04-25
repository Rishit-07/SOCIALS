import React from 'react';
import { useNavigate } from 'react-router-dom';
import DrawOutlineButton from './DrawOutlineButton';

const Navbar = ({ showAuthLinks = true }) => {
    const navigate = useNavigate();

    return (
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
                    onClick={() => navigate('/')}
                    style={{
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
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
                    {showAuthLinks ? (
                        <>
                            <a href="#about" className="nav-link">
                                About
                            </a>
                            <a href="/login" className="nav-link">
                                Sign In
                            </a>

                            {/* ✨ Animated Button */}
                            <DrawOutlineButton href="/register">
                                Sign Up
                            </DrawOutlineButton>
                        </>
                    ) : (
                        <>
                            <a href="/dashboard" className="nav-link">
                                Dashboard
                            </a>
                            <a href="/profile" className="nav-link">
                                Profile
                            </a>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    navigate('/login');
                                }}
                                className="nav-link"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: 'inherit',
                                }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Particles from '../components/Particles';
import RippleButton from '../components/RippleButton';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/api/auth/login', { email, password });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100vh',
            overflow: 'hidden',
            background: '#0f1419',
        }}>
            {/* Particles */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}>
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

            {/* Form */}
            <div style={{
                position: 'absolute',
                width: '100%', height: '100%',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    background: 'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '16px',
                    padding: '2.5rem',
                    width: 'min(420px, 90%)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                    <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        Welcome back
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Sign in to continue to Socials
                    </p>

                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            color: '#ef4444',
                            fontSize: '0.85rem',
                            marginBottom: '1.5rem',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = '#ef4444'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={e => e.target.style.borderColor = '#ef4444'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>

                        <RippleButton
                            type="submit"
                            disabled={loading}
                            rippleColor="#ef4444"
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                background: loading ? 'rgba(239,68,68,0.5)' : '#ef4444',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#fff',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'opacity 0.2s ease',
                            }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </RippleButton>
                    </form>

                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.5rem' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#ef4444', textDecoration: 'none', fontWeight: 600 }}>
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
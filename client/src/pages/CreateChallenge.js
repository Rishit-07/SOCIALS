import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../api/axios';
import Particles from '../components/Particles';
import FloatingWords from '../components/FloatingWords';

const CreateChallenge = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(7);
    const [category, setCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = ['Learning', 'Fitness', 'Health', 'Wellness', 'Creative', 'Coding', 'Reading', 'Other'];
    const durations = [3, 7, 14, 21, 30];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await API.post('/api/challenges', {
                title,
                description,
                duration,
                category,
                startDate,
                isPublic,
            });
            navigate(`/challenge/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.85rem 1rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        backdropFilter: 'blur(4px)',
    };

    return (
        <div
            style={{
               minHeight: 'calc(100vh + var(--dock-safe-space, 0px))',
                paddingBottom: '120px',
                width: '100%',
                background: '#030507',
                position: 'relative',
                overflowX: 'hidden',
            }}
        >

            {/* Particles */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Particles
                    particleCount={70}
                    particleSpread={15}
                    speed={0.04}
                    particleColors={['#ffffff', '#d1d5db']}
                    moveParticlesOnHover={true}
                    particleHoverFactor={1.3}
                    alphaParticles={true}
                    particleBaseSize={80}
                    sizeRandomness={1}
                />
            </div>

            {/* Moving text */}
            <FloatingWords />

            {/* Header */}
            <div style={{ position: 'relative', zIndex: 30, padding: '1.5rem 2rem 0rem 2rem' }}>
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        marginBottom: '1rem',
                    }}
                >
                    ← Back
                </motion.button>

            </div>

            {/* Floating Form */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 60,
                    maxWidth: '560px',
                    margin: '125px auto 70px auto',
                    padding: '0 1rem',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{
                        background: 'rgba(5,8,13,0.56)',
                        backdropFilter: 'blur(18px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '22px',
                        padding: '2rem',
                        boxShadow: '0 0 65px rgba(0,0,0,0.58)',
                    }}
                >
                    {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Title *</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                        </div>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Description *</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} required style={{ ...inputStyle, resize: 'vertical' }} />
                        </div>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Category *</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setCategory(cat)}
                                        style={{
                                            padding: '0.45rem 0.85rem',
                                            borderRadius: '20px',
                                            border: category === cat ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                            background: category === cat ? 'rgba(239,68,68,0.12)' : 'transparent',
                                            color: '#fff',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Duration</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {durations.map(d => (
                                    <button
                                        key={d}
                                        type="button"
                                        onClick={() => setDuration(d)}
                                        style={{
                                            flex: 1,
                                            padding: '0.65rem',
                                            borderRadius: '8px',
                                            border: duration === d ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
                                            background: duration === d ? 'rgba(239,68,68,0.12)' : 'transparent',
                                            color: '#fff',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {d}d
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.2rem' }}>
                            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Start Date *</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required style={{ ...inputStyle, colorScheme: 'dark' }} />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: '#fff', fontSize: '0.85rem' }}>Visibility</label>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setIsPublic(true)} style={{ flex: 1, padding: '0.9rem', background: isPublic ? 'rgba(239,68,68,0.14)' : 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>🌍 Public</button>
                                <button type="button" onClick={() => setIsPublic(false)} style={{ flex: 1, padding: '0.9rem', background: !isPublic ? 'rgba(239,68,68,0.14)' : 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}>🔒 Private</button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !category}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            {loading ? 'Creating...' : 'Create Challenge 🎯'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateChallenge;
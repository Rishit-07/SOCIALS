import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    const [showLoadingScreen, setShowLoadingScreen] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [createdChallengeTitle, setCreatedChallengeTitle] = useState('');

    const motivationalQuotes = [
        "Every great achievement begins with the decision to try. Now go crush it!",
        "You've just taken the first step to amazing things. Keep pushing!",
        "Your challenge awaits. Show the world what you're made of!",
        "Success is not final, failure is not fatal. Keep moving forward!",
        "This challenge is your canvas. Paint it with dedication!",
        "You're not just creating a challenge, you're building your legacy!",
        "The only limit is yourself. Break through it!",
        "Your consistency today is your success tomorrow!",
        "Every day you work on this challenge is a step towards greatness!",
        "You've got this! Now show the world your potential!",
        "This is the beginning of something incredible!",
        "Believe in yourself and commit. You are capable of amazing things!",
    ];

    const getRandomQuote = () => {
        return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    };

    useEffect(() => {
        const wasCelebrating = sessionStorage.getItem('challengeCreated');
        if (wasCelebrating) {
            setShowCelebration(true);
            setCreatedChallengeTitle(sessionStorage.getItem('challengeTitle') || 'Your Challenge');
            const timer = setTimeout(() => {
                setShowCelebration(false);
                sessionStorage.removeItem('challengeCreated');
                sessionStorage.removeItem('challengeTitle');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const categories = ['Learning', 'Fitness', 'Health', 'Wellness', 'Creative', 'Coding', 'Reading', 'Other'];
    const durations = [3, 7, 14, 21, 30];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShowLoadingScreen(true);
        try {
            const res = await API.post('/api/challenges', {
                title,
                description,
                duration,
                category,
                startDate,
                isPublic,
            });
            
            // Store celebration data in sessionStorage
            sessionStorage.setItem('challengeCreated', 'true');
            sessionStorage.setItem('challengeTitle', title);
            setCreatedChallengeTitle(title);
            
            // Show celebration modal
            setTimeout(() => {
                setShowLoadingScreen(false);
                setShowCelebration(true);
                
                // Navigate after celebration
                setTimeout(() => {
                    navigate(`/challenge/${res.data._id}`);
                }, 5000);
            }, 2000);
        } catch (err) {
            setShowLoadingScreen(false);
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

            {/* Loading Overlay */}
            <AnimatePresence>
                {showLoadingScreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.8)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                        }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            style={{
                                width: '60px',
                                height: '60px',
                                border: '4px solid rgba(239, 68, 68, 0.2)',
                                borderTop: '4px solid #ef4444',
                                borderRadius: '50%',
                                marginBottom: '1.5rem',
                            }}
                        />
                        <motion.p
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            style={{
                                color: '#fff',
                                fontSize: '1rem',
                                fontWeight: 500,
                                letterSpacing: '2px',
                            }}
                        >
                            Creating Challenge...
                        </motion.p>
                        <motion.div
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                marginTop: '1rem',
                            }}
                        >
                            {[0, 1, 2].map((index) => (
                                <motion.div
                                    key={index}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: index * 0.15,
                                    }}
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: '#ef4444',
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Celebration Modal */}
            <AnimatePresence>
                {showCelebration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(12px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10000,
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                            exit={{ scale: 0, rotateY: 180, opacity: 0 }}
                            transition={{ duration: 0.8, type: 'spring', stiffness: 50 }}
                            style={{
                                perspective: '1000px',
                                background: 'linear-gradient(135deg, rgba(238, 112, 112, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
                                border: '2px solid rgba(147, 54, 54, 0.4)',
                                borderRadius: '20px',
                                padding: '3rem 2.5rem',
                                textAlign: 'center',
                                maxWidth: '450px',
                                boxShadow: '0 0 80px rgba(159, 80, 80, 0.3), inset 0 0 40px rgba(239, 68, 68, 0.1)',
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                style={{
                                    fontSize: '3.5rem',
                                    marginBottom: '1rem',
                                }}
                            >
                                🎉✨🔥
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                style={{
                                    color: '#fff',
                                    fontSize: '1.8rem',
                                    fontWeight: 700,
                                    marginBottom: '0.5rem',
                                    letterSpacing: '-1px',
                                }}
                            >
                                Challenge Created! 🎯
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                style={{
                                    color: '#e94d4d',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    marginBottom: '1.5rem',
                                }}
                            >
                                "{createdChallengeTitle}"
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(227, 84, 84, 0.2)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                <p
                                    style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '0.95rem',
                                        fontStyle: 'italic',
                                        lineHeight: 1.6,
                                        margin: 0,
                                    }}
                                >
                                    💭 {getRandomQuote()}
                                </p>
                            </motion.div>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '0.9rem',
                                }}
                            >
                                Redirecting to your challenge...
                            </motion.p>

                            <motion.div
                                style={{
                                    marginTop: '1.5rem',
                                    height: '3px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '2px',
                                    overflow: 'hidden',
                                }}
                            >
                                <motion.div
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 5, ease: 'easeInOut' }}
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #ef4444, #f87171)',
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateChallenge;

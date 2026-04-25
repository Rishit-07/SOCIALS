import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Particles from '../components/Particles';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [userChallenges, setUserChallenges] = useState([]);
    const [allChallenges, setAllChallenges] = useState([]);
    const [inviteCode, setInviteCode] = useState('');
    const [joinError, setJoinError] = useState('');
    const [joinSuccess, setJoinSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [totalCheckins, setTotalCheckins] = useState(0);
    const [scrambleGreeting, setScrambleGreeting] = useState('Hellooo.!! 🙌');
    const [showLeaveDialog, setShowLeaveDialog] = useState(false);
    const [challengeToLeave, setChallengeToLeave] = useState(null);
    const [leaving, setLeaving] = useState(false);
    const [leaveError, setLeaveError] = useState('');
    const [showLoadingScreen, setShowLoadingScreen] = useState(false);

    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -50]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.65]);
    const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    const greetingText = `Hello.!! ${user?.name || ''} 🙌`;

    const addToActiveChallenges = useCallback((challenge, participantStatus = 'approved') => {
        if (!challenge?._id) {
            return;
        }

        const currentUserId = String(user?.id || user?._id || '');
        const isCreator =
            String(challenge.createdBy) === currentUserId ||
            String(challenge.createdBy?._id) === currentUserId;

        setUserChallenges((prev) => {
            if (prev.some((c) => String(c._id) === String(challenge._id))) {
                return prev;
            }

            return [
                {
                    ...challenge,
                    isCreator,
                    participantStatus,
                    canLeave: !isCreator && participantStatus !== 'rejected',
                },
                ...prev,
            ];
        });
    }, [user]);

    const removeFromActiveChallenges = useCallback((challengeId) => {
        setUserChallenges((prev) => prev.filter((challenge) => String(challenge._id) !== String(challengeId)));
    }, []);

    const fetchChallenges = useCallback(async () => {
        try {
            const res = await API.get('/api/challenges');
            const all = res.data;
            setAllChallenges(all);

            const currentUserId = String(user?.id || user?._id || '');

            if (!currentUserId) {
                setUserChallenges([]);
                setTotalCheckins(0);
            } else {
                const participantLists = await Promise.all(
                    all.map((challenge) =>
                        API.get(`/api/participants/${challenge._id}`)
                            .then((response) => response.data)
                            .catch(() => [])
                    )
                );

                const participantsByChallenge = {};
                participantLists.forEach((list, index) => {
                    participantsByChallenge[all[index]?._id] = list;
                });

                const mine = all.filter((challenge, index) => {
                    const isCreator =
                        String(challenge.createdBy) === currentUserId ||
                        String(challenge.createdBy?._id) === currentUserId;

                    const isJoinedParticipant = (participantsByChallenge[challenge._id] || []).some((participant) => {
                        const participantUserId = String(participant?.user?._id || participant?.user || '');
                        const participantStatus = participant?.status;
                        return participantUserId === currentUserId && participantStatus !== 'rejected';
                    });

                    return isCreator || isJoinedParticipant;
                }).map((challenge) => {
                    const isCreator =
                        String(challenge.createdBy) === currentUserId ||
                        String(challenge.createdBy?._id) === currentUserId;

                    const participantRecord = (participantsByChallenge[challenge._id] || []).find((participant) => {
                        const participantUserId = String(participant?.user?._id || participant?.user || '');
                        return participantUserId === currentUserId;
                    });

                    const participantStatus = participantRecord?.status || null;

                    return {
                        ...challenge,
                        isCreator,
                        participantStatus,
                        canLeave: !isCreator && participantStatus !== 'rejected',
                    };
                });

                setUserChallenges(mine);

                const checkinLists = await Promise.all(
                    mine.map((challenge) =>
                        API.get(`/api/checkins/${challenge._id}`)
                            .then((response) => response.data)
                            .catch(() => [])
                    )
                );

                const checkinsCount = checkinLists
                    .flat()
                    .filter((checkin) => {
                        const checkinUserId = String(
                            checkin?.participant?.user?._id ||
                            checkin?.participant?.user ||
                            ''
                        );
                        return checkinUserId === currentUserId;
                    }).length;

                setTotalCheckins(checkinsCount);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        // Check if page just reloaded after join/leave
        const wasReloading = sessionStorage.getItem('dashboardReloading');
        if (wasReloading) {
            setShowLoadingScreen(true);
            // Show loading for 1.5 seconds then hide
            const timer = setTimeout(() => {
                setShowLoadingScreen(false);
                sessionStorage.removeItem('dashboardReloading');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        const refreshInterval = window.setInterval(() => {
            fetchChallenges();
        }, 4000);

        const handleFocus = () => {
            fetchChallenges();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchChallenges();
            }
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.clearInterval(refreshInterval);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [fetchChallenges]);

    useEffect(() => {
        if (!greetingText.trim()) {
            return;
        }

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let step = 0;

        const interval = window.setInterval(() => {
            const nextValue = greetingText
                .split('')
                .map((char, index) => {
                    if (char === ' ') {
                        return ' ';
                    }

                    if (index < step) {
                        return greetingText[index];
                    }

                    if (!/[A-Za-z0-9]/.test(char)) {
                        return char;
                    }

                    return letters[Math.floor(Math.random() * letters.length)];
                })
                .join('');

            setScrambleGreeting(nextValue);
            step += 1 / 3;

            if (step >= greetingText.length) {
                window.clearInterval(interval);
                setScrambleGreeting(greetingText);
            }
        }, 65);

        return () => window.clearInterval(interval);
    }, [greetingText]);

    const handleJoin = async (e) => {
        e.preventDefault();
        setJoinError('');
        setJoinSuccess('');
        try {
            const res = await API.post('/api/challenges/join', { inviteCode });
            setJoinSuccess(res.data.message);

            const joinedChallenge = allChallenges.find(
                (challenge) => String(challenge.inviteCode || '').toUpperCase() === String(inviteCode).toUpperCase()
            );
            if (joinedChallenge) {
                addToActiveChallenges(joinedChallenge, res.data?.status || 'approved');
            }

            setInviteCode('');
            sessionStorage.setItem('dashboardReloading', 'true');
            setShowLoadingScreen(true);
            await fetchChallenges();
            setTimeout(() => window.location.reload(), 500);
        } catch (err) {
            setJoinError(err.response?.data?.message || 'Invalid invite code');
        }
    };

    const openLeaveDialog = (challenge, e) => {
        e.stopPropagation();
        setLeaveError('');
        setChallengeToLeave(challenge);
        setShowLeaveDialog(true);
    };

    const closeLeaveDialog = () => {
        if (leaving) {
            return;
        }
        setShowLeaveDialog(false);
        setChallengeToLeave(null);
        setLeaveError('');
    };

    const confirmLeaveChallenge = async () => {
        if (!challengeToLeave?._id) {
            return;
        }

        setLeaving(true);
        setLeaveError('');
        setJoinSuccess('');
        setJoinError('');

        try {
            const res = await API.delete(`/api/participants/${challengeToLeave._id}/leave`);
            setJoinSuccess(res.data?.message || 'Left challenge successfully');
            removeFromActiveChallenges(challengeToLeave._id);
            setShowLeaveDialog(false);
            setChallengeToLeave(null);            sessionStorage.setItem('dashboardReloading', 'true');
            setShowLoadingScreen(true);            await fetchChallenges();
            setTimeout(() => window.location.reload(), 500);
        } catch (err) {
            const serverMessage =
                (typeof err.response?.data === 'string' && err.response.data) ||
                err.response?.data?.message;
            setLeaveError(serverMessage || 'Could not leave challenge');
        } finally {
            setLeaving(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    const sectionRevealVariants = {
        hidden: { opacity: 0, y: 36, scale: 0.98, filter: 'blur(6px)' },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
        }
    };

    const activeChallengeIds = new Set(userChallenges.map((challenge) => String(challenge._id)));
    const suggestedChallenges = allChallenges.filter(
        (challenge) => !activeChallengeIds.has(String(challenge._id))
    );

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#0f1419', position: 'relative' }}>
            <motion.div
                style={{
                    position: 'fixed',
                    top: '-15%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60vw',
                    height: '60vw',
                    borderRadius: '999px',
                    background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, rgba(239,68,68,0.05) 40%, transparent 70%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                    scale: glowScale,
                }}
            />

            {/* Particles */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Particles
                    particleCount={200}
                    particleSpread={15}
                    speed={0.05}
                    particleColors={['#ffffff', '#f3f4f6', '#e5e7eb']}
                    moveParticlesOnHover={true}
                    particleHoverFactor={2}
                    alphaParticles={true}
                    particleBaseSize={120}
                    sizeRandomness={1.2}
                />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 160px 1.5rem' }}>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: '16px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        y: heroY,
                        opacity: heroOpacity,
                    }}
                >
                    <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {scrambleGreeting}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
                        Stay consistent. Stay accountable. Keep competing.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div>
                            <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 700 }}>{allChallenges.length}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Total Challenges</div>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 700 }}>{userChallenges.length}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Your Challenges</div>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <div style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 700 }}>{totalCheckins}</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Check-ins</div>
                        </div>
                    </div>
                </motion.div>

                {/* Your Active Challenges */}
                {userChallenges.length > 0 && (
                    <motion.div
                        variants={sectionRevealVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        style={{ marginBottom: '2rem' }}
                    >
                        <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
                            Your Active Challenges
                        </h2>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.15 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}
                        >
                            {userChallenges.map((challenge) => (
                                <motion.div
                                    key={challenge._id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    style={{
                                        background: 'linear-gradient(rgba(239,68,68,0.08), rgba(239,68,68,0.03))',
                                        border: '1px solid rgba(239,68,68,0.2)',
                                        borderRadius: '14px',
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => navigate(`/challenge/${challenge._id}`)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                            border: '1px solid rgba(239,68,68,0.2)', padding: '3px 10px',
                                            borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                                        }}>
                                            {challenge.category}
                                        </span>
                                        <span style={{
                                            background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                                            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                                        }}>
                                            {challenge.status}
                                        </span>
                                    </div>
                                    <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {challenge.title}
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                                        {challenge.description.length > 80 ? challenge.description.substring(0, 80) + '...' : challenge.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                                            {challenge.duration} days
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                                            Invite: <span style={{ color: '#ef4444', letterSpacing: '1px' }}>{challenge.inviteCode}</span>
                                        </span>
                                    </div>
                                    {challenge.canLeave && (
                                        <div style={{ marginTop: '0.9rem', display: 'flex', justifyContent: 'flex-end' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.04 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => openLeaveDialog(challenge, e)}
                                                style={{
                                                    padding: '0.5rem 0.9rem',
                                                    background: 'rgba(239,68,68,0.14)',
                                                    border: '1px solid rgba(239,68,68,0.35)',
                                                    borderRadius: '999px',
                                                    color: '#ef4444',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Leave Challenge
                                            </motion.button>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}

                {/* Join via Invite Code */}
                <motion.div
                    variants={sectionRevealVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    style={{
                        background: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                    }}
                >
                    <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Join a challenge
                    </h2>
                    <form onSubmit={handleJoin} style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            placeholder="Enter invite code"
                            required
                            style={{
                                flex: 1, padding: '0.75rem 1rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px', color: '#fff',
                                fontSize: '0.9rem', outline: 'none', letterSpacing: '2px',
                            }}
                            onFocus={e => e.target.style.borderColor = '#ef4444'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            style={{
                                padding: '0.75rem 1.5rem', background: '#ef4444',
                                border: 'none', borderRadius: '8px', color: '#fff',
                                fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            Join
                        </motion.button>
                    </form>
                    {joinError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{joinError}</p>}
                    {joinSuccess && <p style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: '0.5rem' }}>{joinSuccess}</p>}
                </motion.div>

                {/* Suggested Challenges */}
                <motion.div
                    variants={sectionRevealVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.18 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600 }}>
                            Suggested Challenges
                        </h2>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/create')}
                            style={{
                                padding: '0.5rem 1rem', background: '#ef4444',
                                border: 'none', borderRadius: '8px', color: '#fff',
                                fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            }}
                        >
                            + Create
                        </motion.button>
                    </div>

                    {loading ? (
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading challenges...</p>
                    ) : suggestedChallenges.length === 0 ? (
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px dashed rgba(255,255,255,0.1)',
                            borderRadius: '16px', padding: '3rem', textAlign: 'center',
                        }}>
                            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>No suggested challenges right now</p>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/create')}
                                style={{
                                    padding: '0.75rem 1.5rem', background: '#ef4444',
                                    border: 'none', borderRadius: '8px', color: '#fff',
                                    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                Create the first challenge
                            </motion.button>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.12 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}
                        >
                            {suggestedChallenges.map((challenge) => (
                                <motion.div
                                    key={challenge._id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, borderColor: 'rgba(239,68,68,0.4)' }}
                                    style={{
                                        background: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '14px', padding: '1.5rem',
                                        cursor: 'pointer', transition: 'border-color 0.2s ease',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                            border: '1px solid rgba(239,68,68,0.2)', padding: '3px 10px',
                                            borderRadius: '20px', fontSize: '11px', fontWeight: 500,
                                        }}>
                                            {challenge.category}
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>
                                            {challenge.duration} days
                                        </span>
                                    </div>
                                    <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        {challenge.title}
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                                        {challenge.description.length > 80 ? challenge.description.substring(0, 80) + '...' : challenge.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate(`/challenge/${challenge._id}`)}
                                            style={{
                                                flex: 1, padding: '0.6rem',
                                                background: 'transparent',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                borderRadius: '8px', color: '#fff',
                                                fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                                            }}
                                        >
                                            View →
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={async () => {
                                                try {
                                                    const res = await API.post('/api/challenges/join', { inviteCode: challenge.inviteCode });
                                                    setJoinSuccess(res.data.message);
                                                    addToActiveChallenges(challenge, res.data?.status || 'approved');
                                                    sessionStorage.setItem('dashboardReloading', 'true');
                                                    setShowLoadingScreen(true);
                                                    await fetchChallenges();
                                                    setTimeout(() => window.location.reload(), 500);
                                                } catch (err) {
                                                    setJoinError(err.response?.data?.message || 'Could not join');
                                                    setTimeout(() => setJoinError(''), 3000);
                                                }
                                            }}
                                            style={{
                                                flex: 1, padding: '0.6rem',
                                                background: '#ef4444', border: 'none',
                                                borderRadius: '8px', color: '#fff',
                                                fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                                            }}
                                        >
                                            Join
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </div>

            <AnimatePresence>
                {showLeaveDialog && challengeToLeave && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 120,
                            background: 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem',
                        }}
                        onClick={closeLeaveDialog}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 42, scale: 0.86, rotateX: -8 }}
                            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                            exit={{ opacity: 0, y: 22, scale: 0.92 }}
                            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                            style={{
                                width: 'min(460px, 100%)',
                                borderRadius: '18px',
                                border: '1px solid rgba(239,68,68,0.28)',
                                background: 'linear-gradient(145deg, rgba(20,24,30,0.95), rgba(15,20,25,0.94))',
                                boxShadow: '0 28px 80px rgba(0,0,0,0.45)',
                                padding: '1.35rem',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: 'rgba(239,68,68,0.16)',
                                    border: '1px solid rgba(239,68,68,0.35)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '0.85rem',
                                    fontSize: '1.25rem',
                                }}
                            >
                                ⚠
                            </div>
                            <h3 style={{ color: '#fff', fontSize: '1.12rem', marginBottom: '0.45rem' }}>
                                Leave this challenge?
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                                You are about to leave <span style={{ color: '#fff', fontWeight: 600 }}>{challengeToLeave.title}</span>. You can rejoin later with the invite code if allowed.
                            </p>

                            {leaveError && (
                                <p style={{ color: '#ef4444', fontSize: '0.84rem', marginBottom: '0.9rem' }}>
                                    {leaveError}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={closeLeaveDialog}
                                    disabled={leaving}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '9px',
                                        color: 'rgba(255,255,255,0.85)',
                                        fontSize: '0.86rem',
                                        fontWeight: 500,
                                        cursor: leaving ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={confirmLeaveChallenge}
                                    disabled={leaving}
                                    style={{
                                        padding: '0.6rem 1rem',
                                        background: leaving ? 'rgba(239,68,68,0.6)' : '#ef4444',
                                        border: 'none',
                                        borderRadius: '9px',
                                        color: '#fff',
                                        fontSize: '0.86rem',
                                        fontWeight: 600,
                                        cursor: leaving ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {leaving ? 'Leaving...' : 'Yes, Leave'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        {/* Animated Spinner */}
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

                        {/* Loading Text */}
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
                            Loading...
                        </motion.p>

                        {/* Animated Dots */}
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
        </div>
    );
};

export default Dashboard;
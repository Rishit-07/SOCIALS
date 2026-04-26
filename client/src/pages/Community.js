import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Particles from '../components/Particles';
import MagicBento from '../components/MagicBento';

const Community = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [checkins, setCheckins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('challenges');
    const [joinError, setJoinError] = useState('');
    const [joinSuccess, setJoinSuccess] = useState('');

    useEffect(() => {
        fetchCommunityData();
    }, []);

    const fetchCommunityData = async () => {
        try {
            const challengeRes = await API.get('/api/challenges');
            setChallenges(challengeRes.data);

            const checkinLists = await Promise.all(
                challengeRes.data.slice(0, 5).map(c =>
                    API.get(`/api/checkins/${c._id}`)
                        .then(res => res.data.map(checkin => ({ ...checkin, challengeTitle: c.title })))
                        .catch(() => [])
                )
            );
            setCheckins(checkinLists.flat().slice(0, 20));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (challenge) => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const res = await API.post('/api/challenges/join', { inviteCode: challenge.inviteCode });
            setJoinSuccess(res.data.message);
            setTimeout(() => setJoinSuccess(''), 3000);
        } catch (err) {
            setJoinError(err.response?.data?.message || 'Could not join');
            setTimeout(() => setJoinError(''), 3000);
        }
    };

    const glassStyle = {
        background: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '1.5rem',
    };

    const tabs = ['challenges', 'leaderboard', 'activity'];

    // Build global leaderboard from all participants
    const [allParticipants, setAllParticipants] = useState([]);

    useEffect(() => {
        if (challenges.length === 0) return;
        const fetchAllParticipants = async () => {
            const lists = await Promise.all(
                challenges.slice(0, 8).map(c =>
                    API.get(`/api/participants/${c._id}`)
                        .then(res => res.data)
                        .catch(() => [])
                )
            );
            const flat = lists.flat();
            // Group by user and sum streaks
            const userMap = {};
            flat.forEach(p => {
                const userId = String(p.user?._id || p.user);
                const userName = p.user?.name || 'Unknown';
                if (!userMap[userId]) {
                    userMap[userId] = { name: userName, totalStreak: 0, totalCheckins: 0, challenges: 0 };
                }
                userMap[userId].totalStreak += p.streakCount || 0;
                userMap[userId].totalCheckins += p.totalCheckIn || 0;
                userMap[userId].challenges += 1;
            });
            const sorted = Object.values(userMap).sort((a, b) => b.totalStreak - a.totalStreak);
            setAllParticipants(sorted);
        };
        fetchAllParticipants();
    }, [challenges]);

    const challengeCards = challenges.map((challenge) => ({
        ...challenge,
        color: '#120F17',
        label: challenge.isPublic ? 'Public' : 'Private',
    }));

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#0f1419', position: 'relative' }}>
            {/* Particles */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Particles
                    particleCount={150}
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

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem 160px 1.5rem' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                        Community 🌍
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem' }}>
                        Browse challenges, see who's winning, and join the action.
                    </p>
                </motion.div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        marginBottom: '2rem',
                    }}
                >
                    {[
                        { label: 'Total Challenges', value: challenges.length, icon: '🎯' },
                        { label: 'Active Users', value: allParticipants.length, icon: '👥' },
                        { label: 'Check-ins Today', value: checkins.filter(c => new Date(c.createdAt).toDateString() === new Date().toDateString()).length, icon: '✅' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                ...glassStyle,
                                textAlign: 'center',
                                padding: '1.25rem',
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                            <div style={{ color: '#ef4444', fontSize: '1.6rem', fontWeight: 700 }}>{stat.value}</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '2px' }}>{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{
                        display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '4px', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}
                >
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1, padding: '0.6rem',
                                background: activeTab === tab ? '#ef4444' : 'transparent',
                                border: 'none', borderRadius: '8px',
                                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
                                fontSize: '0.85rem',
                                fontWeight: activeTab === tab ? 600 : 400,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {tab === 'challenges' ? '🎯 Challenges' : tab === 'leaderboard' ? '🏆 Leaderboard' : '⚡ Activity'}
                        </button>
                    ))}
                </motion.div>

                {/* Join feedback */}
                <AnimatePresence>
                    {(joinSuccess || joinError) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                background: joinSuccess ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                border: `1px solid ${joinSuccess ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                color: joinSuccess ? '#22c55e' : '#ef4444',
                                fontSize: '0.85rem',
                            }}
                        >
                            {joinSuccess || joinError}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Tab Content */}
                <AnimatePresence mode="wait">

                    {/* Challenges Tab */}
                    {activeTab === 'challenges' && (
                        <motion.div
                            key="challenges"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {loading ? (
                                <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading challenges...</p>
                            ) : challenges.length === 0 ? (
                                <div style={{ ...glassStyle, textAlign: 'center', padding: '3rem' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.3)' }}>No challenges yet</p>
                                </div>
                            ) : (
                                <MagicBento
                                    cards={challengeCards}
                                    textAutoHide={false}
                                    enableStars={false}
                                    enableSpotlight={true}
                                    enableBorderGlow={true}
                                    enableTilt={true}
                                    enableMagnetism={true}
                                    clickEffect={true}
                                    spotlightRadius={230}
                                    glowColor="232, 74, 63"
                                    className="community-bento"
                                    renderCard={(challenge) => (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                                <span style={{
                                                    background: 'rgba(232,74,63,0.12)', color: '#e84a3f',
                                                    border: '1px solid rgba(232,74,63,0.22)',
                                                    padding: '3px 10px', borderRadius: '20px',
                                                    fontSize: '11px', fontWeight: 600,
                                                }}>
                                                    {challenge.category}
                                                </span>
                                                <span style={{
                                                    background: challenge.isPublic ? 'rgba(34,197,94,0.1)' : 'rgba(232,74,63,0.1)',
                                                    color: challenge.isPublic ? '#22c55e' : '#e84a3f',
                                                    padding: '3px 8px', borderRadius: '20px', fontSize: '11px',
                                                }}>
                                                    {challenge.isPublic ? '🌍 Public' : '🔒 Private'}
                                                </span>
                                            </div>
                                            <div className="magic-bento-card__content">
                                                <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.45rem' }}>
                                                    {challenge.title}
                                                </h3>
                                                <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.84rem', marginBottom: '0.9rem', lineHeight: 1.5 }}>
                                                    {challenge.description.length > 80 ? challenge.description.substring(0, 80) + '...' : challenge.description}
                                                </p>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem' }}>
                                                    <span style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.8rem' }}>
                                                        📅 {challenge.duration} days
                                                    </span>
                                                    <span style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.8rem' }}>
                                                        {challenge.status}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/challenge/${challenge._id}`);
                                                        }}
                                                        style={{
                                                            flex: 1, padding: '0.6rem',
                                                            background: 'transparent',
                                                            border: '1px solid rgba(255,255,255,0.15)',
                                                            borderRadius: '8px', color: '#fff',
                                                            fontSize: '0.82rem', cursor: 'pointer',
                                                        }}
                                                    >
                                                        View →
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleJoin(challenge);
                                                        }}
                                                        style={{
                                                            flex: 1, padding: '0.6rem',
                                                            background: '#e84a3f', border: 'none',
                                                            borderRadius: '8px', color: '#fff',
                                                            fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                                                        }}
                                                    >
                                                        Join
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                />
                            )}
                        </motion.div>
                    )}

                    {/* Leaderboard Tab */}
                    {activeTab === 'leaderboard' && (
                        <motion.div
                            key="leaderboard"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={glassStyle}
                        >
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                                Global Leaderboard
                            </h3>
                            {allParticipants.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No data yet</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {allParticipants.map((p, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '1rem',
                                                padding: '0.75rem 1rem',
                                                background: i === 0 ? 'rgba(239,68,68,0.08)' : i === 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                                                borderRadius: '10px',
                                                border: i === 0 ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.05)',
                                            }}
                                        >
                                            <div style={{ fontSize: '1.2rem', width: '30px', textAlign: 'center' }}>
                                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                                            </div>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: 'rgba(239,68,68,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#ef4444', fontWeight: 700, fontSize: '13px', flexShrink: 0,
                                            }}>
                                                {p.name?.[0]?.toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{p.name}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                                                    {p.challenges} challenges · {p.totalCheckins} check-ins
                                                </div>
                                            </div>
                                            <div style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 700 }}>
                                                🔥 {p.totalStreak}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <motion.div
                            key="activity"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={glassStyle}
                        >
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                                Recent Activity
                            </h3>
                            {checkins.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No activity yet</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {checkins.map((checkin, i) => (
                                        <motion.div
                                            key={checkin._id || i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '1rem',
                                                padding: '0.75rem 1rem',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                            }}
                                        >
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: 'rgba(34,197,94,0.15)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '16px', flexShrink: 0,
                                            }}>
                                                ✅
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 500 }}>
                                                    Checked in for <span style={{ color: '#ef4444' }}>{checkin.challengeTitle}</span>
                                                </div>
                                                {checkin.note && (
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '2px' }}>
                                                        "{checkin.note}"
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', flexShrink: 0 }}>
                                                {new Date(checkin.createdAt).toLocaleDateString()}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Community;
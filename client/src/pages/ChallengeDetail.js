import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Particles from '../components/Particles';
import io from 'socket.io-client';

const ChallengeDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const socketRef = useRef(null);

    const [challenge, setChallenge] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [checkins, setCheckins] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeTab, setActiveTab] = useState('checkin');
    const [loading, setLoading] = useState(true);
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkinNote, setCheckinNote] = useState('');
    const [checkinSuccess, setCheckinSuccess] = useState('');
    const [checkinError, setCheckinError] = useState('');
    const [pendingParticipants, setPendingParticipants] = useState([]);
    const messagesEndRef = useRef(null);

    const getId = (value) => {
        if (!value) return '';
        if (typeof value === 'string' || typeof value === 'number') return String(value);
        if (typeof value === 'object') {
            return String(value._id || value.id || '');
        }
        return String(value);
    };

    useEffect(() => {
        fetchChallenge();
        fetchParticipants();
        fetchCheckins();
        fetchPendingParticipants();

        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join-room', id);
        socketRef.current.on('receive-message', (message) => {
            setMessages(prev => [...prev, message]);
        });
        socketRef.current.on('new-join-request', () => {
            fetchPendingParticipants();
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChallenge = async () => {
        try {
            const res = await API.get(`/api/challenges/${id}`);
            setChallenge(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingParticipants = async () => {
        try {
            const res = await API.get(`/api/participants/${id}/pending`);
            setPendingParticipants(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchParticipants = async () => {
        try {
            const res = await API.get(`/api/participants/${id}`);
            setParticipants(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCheckins = async () => {
        try {
            const res = await API.get(`/api/checkins/${id}`);
            setCheckins(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckin = async (e) => {
        e.preventDefault();
        setCheckingIn(true);
        setCheckinError('');
        setCheckinSuccess('');
        try {
            await API.post('/api/checkins', { challengeId: id, note: checkinNote });
            setCheckinSuccess('Checked in successfully!');
            setCheckinNote('');
            fetchCheckins();
        } catch (err) {
            setCheckinError(err.response?.data?.message || 'Could not check in');
        } finally {
            setCheckingIn(false);
        }
    };

    const handleApprove = async (participantId) => {
        try {
            await API.put(`/api/participants/${participantId}/approve`);
            fetchPendingParticipants();
            fetchParticipants();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReject = async (participantId) => {
        try {
            await API.put(`/api/participants/${participantId}/reject`);
            fetchPendingParticipants();
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim()) return;
        const message = {
            text: newMessage,
            sender: user?.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            userId: user?.id || user?._id,
        };
        socketRef.current.emit('send-message', { roomId: id, message });
        setMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const isOwner = challenge && getId(challenge.createdBy) === getId(user);

    const tabs = isOwner
        ? ['checkin', 'members', 'chat', 'leaderboard', 'requests']
        : ['checkin', 'members', 'chat', 'leaderboard'];

    const glassStyle = {
        background: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '1.5rem',
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', background: '#0f1419', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
        </div>
    );

    if (!challenge) return (
        <div style={{ minHeight: '100vh', background: '#0f1419', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Challenge not found</p>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#0f1419', position: 'relative' }}>
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

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 160px 1.5rem' }}>

                {/* Back */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    ← Back
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ ...glassStyle, marginBottom: '1.5rem' }}
                >
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500 }}>
                            {challenge.category}
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px' }}>
                            {challenge.status}
                        </span>
                        <span style={{ background: challenge.isPublic ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: challenge.isPublic ? '#22c55e' : '#ef4444', padding: '3px 10px', borderRadius: '20px', fontSize: '11px' }}>
                            {challenge.isPublic ? '🌍 Public' : '🔒 Private'}
                        </span>
                    </div>
                    <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        {challenge.title}
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                        {challenge.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>👥 {participants.length} participants</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>📅 {challenge.duration} days</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                            🔑 <span style={{ color: '#ef4444', letterSpacing: '2px', fontWeight: 600 }}>{challenge.inviteCode}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                background: activeTab === tab ? '#ef4444' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
                                fontSize: '0.8rem',
                                fontWeight: activeTab === tab ? 600 : 400,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                            }}
                        >
                            {tab}
                            {tab === 'requests' && pendingParticipants.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    background: '#fff',
                                    color: '#ef4444',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {pendingParticipants.length}
                                </span>
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">

                    {/* Checkin Tab */}
                    {activeTab === 'checkin' && (
                        <motion.div
                            key="checkin"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div style={{ ...glassStyle, marginBottom: '1rem' }}>
                                <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    Daily Check-in
                                </h3>
                                <form onSubmit={handleCheckin}>
                                    <input
                                        type="text"
                                        value={checkinNote}
                                        onChange={e => setCheckinNote(e.target.value)}
                                        placeholder="Add a note (optional)"
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
                                            marginBottom: '0.75rem',
                                        }}
                                        onFocus={e => e.target.style.borderColor = '#ef4444'}
                                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={checkingIn}
                                        style={{
                                            width: '100%',
                                            padding: '0.85rem',
                                            background: checkingIn ? 'rgba(239,68,68,0.5)' : '#ef4444',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            cursor: checkingIn ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {checkingIn ? 'Checking in...' : '✅ Check in for today'}
                                    </motion.button>
                                </form>
                                {checkinSuccess && <p style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: '0.5rem' }}>{checkinSuccess}</p>}
                                {checkinError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{checkinError}</p>}
                            </div>

                            {/* Check-in History */}
                            <div style={glassStyle}>
                                <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                                    Check-in History
                                </h3>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {Array.from({ length: challenge.duration }, (_, i) => {
                                        const date = new Date(challenge.startDate);
                                        date.setHours(0, 0, 0, 0);
                                        date.setDate(date.getDate() + i);

                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);

                                        const dateStr = date.toDateString();
                                        const checked = checkins.some(c => {
                                            const checkinDate = new Date(c.createdAt);
                                            checkinDate.setHours(0, 0, 0, 0);
                                            return checkinDate.toDateString() === dateStr;
                                        });
                                        const isPast = date < today;
                                        const isToday = date.getTime() === today.getTime();

                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                                style={{
                                                    width: '70px',
                                                    padding: '0.6rem 0.5rem',
                                                    borderRadius: '10px',
                                                    textAlign: 'center',
                                                    border: isToday
                                                        ? '2px dashed rgba(239,68,68,0.5)'
                                                        : checked
                                                        ? '1px solid rgba(34,197,94,0.4)'
                                                        : isPast
                                                        ? '1px solid rgba(239,68,68,0.2)'
                                                        : '1px solid rgba(255,255,255,0.06)',
                                                    background: checked
                                                        ? 'rgba(34,197,94,0.08)'
                                                        : isPast && !isToday
                                                        ? 'rgba(239,68,68,0.08)'
                                                        : 'rgba(255,255,255,0.03)',
                                                }}
                                            >
                                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginBottom: '4px' }}>
                                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </div>
                                                <div style={{ fontSize: '1rem', color: checked ? '#22c55e' : isPast ? '#ef4444' : 'rgba(255,255,255,0.3)' }}>
                                                    {checked ? '✓' : isPast ? '✗' : '·'}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Progress Bar */}
                                <div style={{ marginTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Progress</span>
                                        <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {Math.round((checkins.length / challenge.duration) * 100)}%
                                        </span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(checkins.length / challenge.duration) * 100}%` }}
                                            transition={{ duration: 1, ease: 'easeOut' }}
                                            style={{ height: '100%', background: '#ef4444', borderRadius: '3px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{checkins.length} check-ins</span>
                                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{challenge.duration} days total</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Members Tab */}
                    {activeTab === 'members' && (
                        <motion.div
                            key="members"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={glassStyle}
                        >
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                                Members ({participants.length})
                            </h3>
                            {participants.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No members yet</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {participants.map((p, i) => (
                                        <motion.div
                                            key={p._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                padding: '0.75rem 1rem',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                            }}
                                        >
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#ef4444', fontWeight: 700, fontSize: '13px', flexShrink: 0,
                                            }}>
                                                {p.user?.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{p.user?.name || 'Unknown'}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{p.totalCheckIn} check-ins</div>
                                            </div>
                                            <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                                                🔥 {p.streakCount} streak
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Chat Tab */}
                    {activeTab === 'chat' && (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={{ ...glassStyle, display: 'flex', flexDirection: 'column', height: '450px' }}
                        >
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Group Chat</h3>
                            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', paddingRight: '0.25rem' }}>
                                {messages.length === 0 ? (
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
                                        No messages yet. Start the conversation!
                                    </p>
                                ) : (
                                    messages.map((msg, i) => {
                                        const isMe = msg.userId === (user?.id || user?._id);
                                        return (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '0.5rem', alignItems: 'flex-end' }}
                                            >
                                                <div style={{
                                                    width: '28px', height: '28px', borderRadius: '50%',
                                                    background: isMe ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '11px', fontWeight: 700, color: isMe ? '#ef4444' : '#fff', flexShrink: 0,
                                                }}>
                                                    {msg.sender?.[0]?.toUpperCase()}
                                                </div>
                                                <div style={{
                                                    maxWidth: '70%',
                                                    padding: '0.6rem 0.85rem',
                                                    background: isMe ? '#ef4444' : 'rgba(255,255,255,0.08)',
                                                    borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                                                    color: '#fff',
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.4,
                                                }}>
                                                    {!isMe && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '2px' }}>{msg.sender}</div>}
                                                    {msg.text}
                                                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px', textAlign: 'right' }}>{msg.time}</div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    style={{
                                        flex: 1, padding: '0.75rem 1rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none',
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#ef4444'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={sendMessage}
                                    style={{ padding: '0.75rem 1.25rem', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Send
                                </motion.button>
                            </div>
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
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Leaderboard</h3>
                            {participants.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No participants yet</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {[...participants]
                                        .sort((a, b) => b.streakCount - a.streakCount)
                                        .map((p, i) => (
                                            <motion.div
                                                key={p._id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                                    padding: '0.75rem 1rem',
                                                    background: i === 0 ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
                                                    borderRadius: '8px',
                                                    border: i === 0 ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.06)',
                                                }}
                                            >
                                                <div style={{ fontSize: '1.1rem', width: '28px', textAlign: 'center' }}>
                                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                                                </div>
                                                <div style={{
                                                    width: '36px', height: '36px', borderRadius: '50%',
                                                    background: 'rgba(239,68,68,0.2)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: '#ef4444', fontWeight: 700, fontSize: '13px',
                                                }}>
                                                    {p.user?.name?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{p.user?.name || 'Unknown'}</div>
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{p.totalCheckIn} check-ins</div>
                                                </div>
                                                <div style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 700 }}>🔥 {p.streakCount}</div>
                                            </motion.div>
                                        ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Requests Tab - only visible to owner */}
                    {activeTab === 'requests' && isOwner && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={glassStyle}
                        >
                            <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                                Join Requests
                                {pendingParticipants.length > 0 && (
                                    <span style={{ background: '#ef4444', color: '#fff', borderRadius: '20px', padding: '2px 8px', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                        {pendingParticipants.length}
                                    </span>
                                )}
                            </h3>
                            {pendingParticipants.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No pending requests</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {pendingParticipants.map((p, i) => (
                                        <motion.div
                                            key={p._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '1rem',
                                                padding: '0.75rem 1rem',
                                                background: 'rgba(255,255,255,0.03)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255,255,255,0.06)',
                                            }}
                                        >
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '50%',
                                                background: 'rgba(239,68,68,0.2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#ef4444', fontWeight: 700, fontSize: '13px', flexShrink: 0,
                                            }}>
                                                {p.user?.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{p.user?.name || 'Unknown'}</div>
                                                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{p.user?.email}</div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleApprove(p._id)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'rgba(34,197,94,0.15)',
                                                        border: '1px solid rgba(34,197,94,0.3)',
                                                        borderRadius: '8px',
                                                        color: '#22c55e',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ✓ Approve
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleReject(p._id)}
                                                    style={{
                                                        padding: '0.5rem 1rem',
                                                        background: 'rgba(239,68,68,0.15)',
                                                        border: '1px solid rgba(239,68,68,0.3)',
                                                        borderRadius: '8px',
                                                        color: '#ef4444',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ✗ Reject
                                                </motion.button>
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

export default ChallengeDetail;
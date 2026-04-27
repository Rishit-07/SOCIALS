import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Particles from '../components/Particles';

const TYPE_STYLES = {
    checkin: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', icon: '✅' },
    reminder: { color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)', icon: '⏰' },
    missed: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '❌' },
    joined: { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', icon: '🎉' },
    approved: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', icon: '✓' },
    rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', icon: '✗' },
};

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
};

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get('/api/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await API.put(`/api/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await API.put('/api/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    const glassStyle = {
        background: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '1.5rem',
    };

    const filters = ['all', 'unread', 'checkin', 'reminder', 'missed'];

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#0f1419', position: 'relative' }}>
            {/* Particles */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Particles
                    particleCount={100}
                    particleSpread={15}
                    speed={0.04}
                    particleColors={['#ffffff', '#f3f4f6']}
                    moveParticlesOnHover={false}
                    alphaParticles={true}
                    particleBaseSize={100}
                    sizeRandomness={1.2}
                />
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', margin: '0 auto', padding: '2.5rem 1.5rem 160px' }}>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                Notifications
                                {unreadCount > 0 && (
                                    <span style={{
                                        marginLeft: '0.75rem',
                                        background: '#ef4444',
                                        color: '#fff',
                                        borderRadius: '20px',
                                        padding: '2px 10px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        verticalAlign: 'middle',
                                    }}>
                                        {unreadCount}
                                    </span>
                                )}
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                                Stay on top of your challenges
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleMarkAllRead}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Mark all read
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: 'flex', gap: '0.5rem', marginBottom: '1.5rem',
                        flexWrap: 'wrap',
                    }}
                >
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '0.45rem 1rem',
                                background: filter === f ? '#ef4444' : 'rgba(255,255,255,0.04)',
                                border: filter === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '20px',
                                color: filter === f ? '#fff' : 'rgba(255,255,255,0.5)',
                                fontSize: '0.8rem',
                                fontWeight: filter === f ? 600 : 400,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {f === 'checkin' ? '✅ Check-ins' :
                             f === 'reminder' ? '⏰ Reminders' :
                             f === 'missed' ? '❌ Missed' :
                             f === 'unread' ? `🔴 Unread ${unreadCount > 0 ? `(${unreadCount})` : ''}` :
                             '🔔 All'}
                        </button>
                    ))}
                </motion.div>

                {/* Notifications List */}
                {loading ? (
                    <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '3rem' }}>
                        Loading notifications...
                    </p>
                ) : filteredNotifications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ ...glassStyle, textAlign: 'center', padding: '3rem' }}
                    >
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
                            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                        </p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {filteredNotifications.map((notification, i) => {
                                const style = TYPE_STYLES[notification.type] || TYPE_STYLES.checkin;
                                return (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: i * 0.04 }}
                                        onClick={() => {
                                            if (!notification.read) handleMarkAsRead(notification._id);
                                            if (notification.challenge?._id) {
                                                navigate(`/challenge/${notification.challenge._id}`);
                                            }
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '1rem',
                                            padding: '1rem 1.25rem',
                                            background: notification.read ? 'rgba(255,255,255,0.02)' : style.bg,
                                            border: `1px solid ${notification.read ? 'rgba(255,255,255,0.06)' : style.border}`,
                                            borderRadius: '12px',
                                            cursor: notification.challenge ? 'pointer' : 'default',
                                            transition: 'all 0.2s ease',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Unread dot */}
                                        {!notification.read && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem', right: '1rem',
                                                width: '8px', height: '8px',
                                                borderRadius: '50%',
                                                background: '#ef4444',
                                            }} />
                                        )}

                                        {/* Icon */}
                                        <div style={{
                                            width: '40px', height: '40px',
                                            borderRadius: '10px',
                                            background: style.bg,
                                            border: `1px solid ${style.border}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.1rem', flexShrink: 0,
                                        }}>
                                            {style.icon}
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                color: notification.read ? 'rgba(255,255,255,0.7)' : '#fff',
                                                fontSize: '0.9rem',
                                                fontWeight: notification.read ? 400 : 600,
                                                marginBottom: '0.25rem',
                                            }}>
                                                {notification.title}
                                            </div>
                                            <div style={{
                                                color: 'rgba(255,255,255,0.45)',
                                                fontSize: '0.82rem',
                                                lineHeight: 1.5,
                                                marginBottom: '0.4rem',
                                            }}>
                                                {notification.message}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>
                                                    {timeAgo(notification.createdAt)}
                                                </span>
                                                {notification.challenge && (
                                                    <span style={{
                                                        color: style.color,
                                                        fontSize: '0.72rem',
                                                        fontWeight: 600,
                                                    }}>
                                                        {notification.challenge.title}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default Notifications;
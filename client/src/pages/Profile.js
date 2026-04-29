import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Particles from '../components/Particles';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import BADGES from '../config/badges';

const Profile = () => {
    const { user, logout, updateUser } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [claiming, setClaiming] = useState(false);
    const [claimStatus, setClaimStatus] = useState({ type: '', message: '' });
    const [rewards, setRewards] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editChallenge, setEditChallenge] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editSaving, setEditSaving] = useState(false);
    const [editStatus, setEditStatus] = useState({ type: '', message: '' });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        role: user?.role || 'Productivity Warrior',
        avatarFile: null,
    });
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setProfileForm((prev) => ({
            ...prev,
            name: user?.name || '',
            role: user?.role || 'Productivity Warrior',
        }));
    }, [user?.name, user?.role]);

    useEffect(() => {
        if (!profileForm.avatarFile) return undefined;
        const objectUrl = URL.createObjectURL(profileForm.avatarFile);
        setAvatarPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [profileForm.avatarFile]);

    const fetchProfileData = async () => {
        try {
            const [rewardsRes, challengesRes, statsRes] = await Promise.all([
                API.get('/api/rewards'),
                API.get('/api/challenges'),
                API.get('/api/users/stats'),
            ]);
            setRewards(rewardsRes.data);
            setStats(statsRes.data);

            const allChallenges = challengesRes.data;
            const currentUserId = String(user?.id || user?._id || '');

            if (!currentUserId) {
                setChallenges([]);
                return;
            }

            const participantLists = await Promise.all(
                allChallenges.map((challenge) =>
                    API.get(`/api/participants/${challenge._id}`)
                        .then((res) => res.data)
                        .catch(() => [])
                )
            );

            const mine = allChallenges.filter((challenge, index) => {
                const creatorId = String(challenge.createdBy?._id || challenge.createdBy || '');
                const isCreator = creatorId === currentUserId;
                const isApprovedParticipant = participantLists[index].some((participant) => {
                    const participantUserId = String(participant.user?._id || participant.user || '');
                    return participantUserId === currentUserId && participant.status === 'approved';
                });

                return isCreator || isApprovedParticipant;
            });

            setChallenges(mine);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {


        fetchProfileData();
    }, [user?.id, user?._id]);

    const getAvatarUrl = (avatarValue) => {
        if (!avatarValue) {
            return '/default-avatar.png';
        }
        if (avatarValue.startsWith('http://') || avatarValue.startsWith('https://')) {
            return avatarValue;
        }
        if (avatarValue.startsWith('/')) {
            return `${API.defaults.baseURL}${avatarValue}`;
        }
        return `${API.defaults.baseURL}/${avatarValue}`;
    };

    const displayedAvatar = avatarPreviewUrl || getAvatarUrl(user?.avatar);

    const currentUserId = String(user?.id || user?._id || '');

    const canDeleteChallenge = (challenge) => {
        if (!challenge) return false;
        const creatorId = String(challenge.createdBy?._id || challenge.createdBy || '');
        return creatorId === currentUserId;
    };

    const handleEditChallenge = (challenge) => {
        setEditChallenge(challenge);
        setEditForm({
            title: challenge.title || '',
            description: challenge.description || '',
            duration: challenge.duration || 1,
            category: challenge.category || '',
            startDate: challenge.startDate ? new Date(challenge.startDate).toISOString().split('T')[0] : '',
            isPublic: challenge.isPublic !== undefined ? challenge.isPublic : true,
        });
        setEditStatus({ type: '', message: '' });
    };

    const handleSaveChallenge = async (e) => {
        e.preventDefault();
        setEditSaving(true);
        setEditStatus({ type: '', message: '' });

        try {
            const res = await API.put(`/api/challenges/${editChallenge._id}`, {
                title: editForm.title,
                description: editForm.description,
                duration: editForm.duration,
                category: editForm.category,
                startDate: editForm.startDate,
                isPublic: editForm.isPublic,
            });

            // Update the challenges list with the updated challenge
            setChallenges(prev => prev.map(c => c._id === editChallenge._id ? res.data : c));
            setEditStatus({ type: 'success', message: 'Challenge updated successfully!' });
            setTimeout(() => {
                setEditChallenge(null);
                setEditForm({});
            }, 1500);
        } catch (err) {
            setEditStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to update challenge',
            });
        } finally {
            setEditSaving(false);
        }
    };

    const handleDelete = async (challengeId) => {
        try {
            await API.delete(`/api/challenges/${challengeId}`);
            setChallenges(prev => prev.filter(c => c._id !== challengeId));
            setDeleteConfirm(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        setSaveStatus({ type: '', message: '' });

        try {
            const formData = new FormData();
            formData.append('name', profileForm.name);
            formData.append('role', profileForm.role);
            if (profileForm.avatarFile) {
                formData.append('avatar', profileForm.avatarFile);
            }

            const res = await API.put('/api/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const refreshedUser = {
                ...(user || {}),
                ...(res.data?.user || {}),
            };

            if (updateUser) {
                updateUser(refreshedUser);
            } else {
                localStorage.setItem('user', JSON.stringify(refreshedUser));
            }

            setProfileForm((prev) => ({
                ...prev,
                avatarFile: null,
                name: refreshedUser.name || prev.name,
                role: refreshedUser.role || prev.role,
            }));
            setAvatarPreviewUrl('');
            setIsEditingProfile(false);
            setSaveStatus({ type: 'success', message: 'Profile saved successfully.' });
        } catch (err) {
            setSaveStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to save profile',
            });
        } finally {
            setSavingProfile(false);
        }
    };

    const glassStyle = {
        background: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '1.5rem',
        marginBottom: '1.25rem',
    };

    const rewardIcons = {
        'Streak': '🔥',
        'Winner': '🏆',
        'Participation': '⭐',
    };

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#0f1419', position: 'relative', overflow: 'hidden' }}>
            {/* Particles */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
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

            <div style={{ position: 'relative', zIndex: 5, maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem 160px 1.5rem' }}>

                {/* Premium Hero */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        ...glassStyle,
                        padding: '1.4rem',
                        marginBottom: '1.4rem',
                        background: 'linear-gradient(145deg, rgba(239,68,68,0.12), rgba(17,24,39,0.38))',
                    }}
                >
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '1.25rem',
                            alignItems: 'stretch',
                        }}
                    >
                        <ProfileCard
                            name={profileForm.name}
                            role={profileForm.role}
                            avatarUrl={displayedAvatar}
                            cardRarity={user?.cardRarity || 'common'}
                        />

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.45 }}
                            style={{
                                ...glassStyle,
                                marginBottom: 0,
                                padding: '1.4rem',
                                background: 'linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                                minHeight: '420px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                gap: '0.95rem',
                            }}
                        >
                            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                                Profile Command Deck
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '0.88rem', margin: 0 }}>
                                {isEditingProfile
                                    ? 'Update your identity details and save changes.'
                                    : 'Your profile card is locked. Click edit to modify details.'}
                            </p>

                            {!isEditingProfile ? (
                                <>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '12px',
                                        padding: '0.95rem',
                                    }}>
                                        <p style={{ color: '#fff', margin: '0 0 0.4rem', fontWeight: 600, fontSize: '0.95rem' }}>{profileForm.name || 'Creator'}</p>
                                        <p style={{ color: 'rgba(255,255,255,0.58)', margin: 0, fontSize: '0.84rem' }}>{profileForm.role || 'Productivity Warrior'}</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/edit-profile')}
                                        style={{
                                            marginTop: '0.4rem',
                                            width: '100%',
                                            padding: '0.88rem',
                                            borderRadius: '10px',
                                            border: '1px solid rgba(239,68,68,0.36)',
                                            background: 'rgba(239,68,68,0.12)',
                                            color: '#ef4444',
                                            fontSize: '0.92rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Edit Profile
                                    </motion.button>
                                </>
                            ) : (
                                <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
                                    <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500 }}>Username</label>
                                    <input
                                        type="text"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: '10px',
                                            color: '#fff',
                                            padding: '0.8rem 0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                        placeholder="Enter display name"
                                    />

                                    <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500 }}>Role / Title</label>
                                    <input
                                        type="text"
                                        value={profileForm.role}
                                        onChange={(e) => setProfileForm((prev) => ({ ...prev, role: e.target.value }))}
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: '10px',
                                            color: '#fff',
                                            padding: '0.8rem 0.9rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                        placeholder="Productivity Warrior"
                                    />

                                    <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500 }}>Avatar Upload</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                            setProfileForm((prev) => ({ ...prev, avatarFile: file }));
                                        }}
                                        style={{
                                            width: '100%',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: '10px',
                                            color: 'rgba(255,255,255,0.7)',
                                            padding: '0.62rem 0.75rem',
                                            boxSizing: 'border-box',
                                        }}
                                    />

                                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={savingProfile}
                                            style={{
                                                flex: 1,
                                                marginTop: '0.4rem',
                                                padding: '0.88rem',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: savingProfile ? 'rgba(239,68,68,0.6)' : '#ef4444',
                                                color: '#fff',
                                                fontSize: '0.92rem',
                                                fontWeight: 700,
                                                cursor: savingProfile ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {savingProfile ? 'Saving...' : 'Save'}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => {
                                                setProfileForm((prev) => ({
                                                    ...prev,
                                                    name: user?.name || '',
                                                    role: user?.role || 'Productivity Warrior',
                                                    avatarFile: null,
                                                }));
                                                setAvatarPreviewUrl('');
                                                setSaveStatus({ type: '', message: '' });
                                                setIsEditingProfile(false);
                                            }}
                                            style={{
                                                flex: 1,
                                                marginTop: '0.4rem',
                                                padding: '0.88rem',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'transparent',
                                                color: '#fff',
                                                fontSize: '0.92rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            )}

                            {saveStatus.message && (
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '0.82rem',
                                        color: saveStatus.type === 'success' ? '#22c55e' : '#ef4444',
                                    }}
                                >
                                    {saveStatus.message}
                                </p>
                            )}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stats Counters */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    style={{
                        ...glassStyle,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '0.9rem',
                    }}
                >
                    {[
                        { label: 'Challenges', value: challenges.length, icon: '🎯' },
                        { label: 'Rewards', value: rewards.length, icon: '🏆' },
                        { label: 'Streak', value: 0, icon: '🔥' },
                    ].map((item) => (
                        <div
                            key={item.label}
                            style={{
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.22)',
                                borderRadius: '12px',
                                padding: '0.95rem 1rem',
                            }}
                        >
                            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                                {item.icon} {item.label}
                            </div>
                            <div style={{ color: '#ef4444', fontSize: '1.55rem', fontWeight: 700 }}>{item.value}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Badges Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    style={glassStyle}
                >
                    <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Badges & Rewards
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                        {BADGES.map((badge, i) => {
                            const earned = rewards.some(r => r.title === badge.reward.title);
                            const unlocked = stats ? badge.check(stats) : false;
                            const canClaim = unlocked && !earned;

                            return (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05, type: 'spring', bounce: 0.3 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    onClick={() => setSelectedBadge(badge)}
                                    style={{
                                        background: earned ? badge.bg : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${earned ? badge.border : canClaim ? badge.border : 'rgba(255,255,255,0.08)'}`,
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        filter: earned ? 'none' : canClaim ? 'none' : 'grayscale(0.8)',
                                        opacity: earned ? 1 : canClaim ? 0.85 : 0.5,
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {/* Claim indicator */}
                                    {canClaim && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            style={{
                                                position: 'absolute',
                                                top: '-4px', right: '-4px',
                                                width: '12px', height: '12px',
                                                borderRadius: '50%',
                                                background: '#22c55e',
                                                border: '2px solid #0f1419',
                                            }}
                                        />
                                    )}

                                    {/* Earned checkmark */}
                                    {earned && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-4px', right: '-4px',
                                            width: '16px', height: '16px',
                                            borderRadius: '50%',
                                            background: '#22c55e',
                                            border: '2px solid #0f1419',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '8px', color: '#fff', fontWeight: 700,
                                        }}>
                                            ✓
                                        </div>
                                    )}

                                    <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem', filter: earned ? 'none' : 'grayscale(0.5)' }}>
                                        {badge.icon}
                                    </div>
                                    <div style={{
                                        color: earned ? badge.color : canClaim ? badge.color : 'rgba(255,255,255,0.4)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        marginBottom: '0.2rem',
                                    }}>
                                        {badge.title}
                                    </div>
                                    <div style={{
                                        color: 'rgba(255,255,255,0.3)',
                                        fontSize: '0.65rem',
                                        textTransform: 'capitalize',
                                    }}>
                                        {badge.rarity}
                                    </div>
                                    {canClaim && (
                                        <div style={{
                                            marginTop: '0.4rem',
                                            color: '#22c55e',
                                            fontSize: '0.65rem',
                                            fontWeight: 700,
                                        }}>
                                            CLAIM!
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Badge Detail Modal */}
                <AnimatePresence>
                    {selectedBadge && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => {
                                    setSelectedBadge(null);
                                    setClaimStatus({ type: '', message: '' });
                                }}
                                style={{
                                    position: 'fixed', inset: 0,
                                    background: 'rgba(0,0,0,0.7)',
                                    backdropFilter: 'blur(6px)',
                                    zIndex: 40,
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 30 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                style={{
                                    position: 'relative',
                                    top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'linear-gradient(145deg, #1a1020, #0f1419)',
                                    border: `1px solid ${selectedBadge.border}`,
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    zIndex: 41,
                                    width: 'min(400px, 90%)',
                                    textAlign: 'center',
                                    boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${selectedBadge.bg}`,
                                }}
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Badge icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                                    style={{
                                        fontSize: '4rem',
                                        marginBottom: '1rem',
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: selectedBadge.bg,
                                        border: `2px solid ${selectedBadge.border}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem',
                                        boxShadow: `0 0 30px ${selectedBadge.bg}`,
                                    }}
                                >
                                    {selectedBadge.icon}
                                </motion.div>

                                {/* Rarity badge */}
                                <div style={{
                                    display: 'inline-block',
                                    background: selectedBadge.bg,
                                    border: `1px solid ${selectedBadge.border}`,
                                    borderRadius: '20px',
                                    padding: '3px 12px',
                                    color: selectedBadge.color,
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '0.75rem',
                                }}>
                                    {selectedBadge.rarity}
                                </div>

                                <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                                    {selectedBadge.title}
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                                    {selectedBadge.description}
                                </p>

                                {/* Task */}
                                <div style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    marginBottom: '1.25rem',
                                    textAlign: 'left',
                                }}>
                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                                        How to earn
                                    </div>
                                    <div style={{ color: '#fff', fontSize: '0.88rem', lineHeight: 1.5 }}>
                                        {selectedBadge.task}
                                    </div>
                                </div>

                                {/* Progress / Status */}
                                {(() => {
                                    const earned = rewards.some(r => r.title === selectedBadge.reward.title);
                                    const unlocked = stats ? selectedBadge.check(stats) : false;
                                    const canClaim = unlocked && !earned;

                                    if (earned) {
                                        return (
                                            <div style={{
                                                padding: '0.75rem',
                                                background: 'rgba(34,197,94,0.1)',
                                                border: '1px solid rgba(34,197,94,0.3)',
                                                borderRadius: '10px',
                                                color: '#22c55e',
                                                fontSize: '0.88rem',
                                                fontWeight: 600,
                                            }}>
                                                ✓ Badge earned!
                                            </div>
                                        );
                                    }

                                    if (canClaim) {
                                        return (
                                            <>
                                                {claimStatus.message && (
                                                    <div style={{
                                                        marginBottom: '0.75rem',
                                                        padding: '0.6rem',
                                                        borderRadius: '8px',
                                                        background: claimStatus.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                                        color: claimStatus.type === 'success' ? '#22c55e' : '#ef4444',
                                                        fontSize: '0.82rem',
                                                    }}>
                                                        {claimStatus.message}
                                                    </div>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    disabled={claiming}
                                                    onClick={async () => {
                                                        setClaiming(true);
                                                        setClaimStatus({ type: '', message: '' });
                                                        try {
                                                            await API.post('/api/users/claim-badge', {
                                                                badgeId: selectedBadge.id,
                                                                rewardType: selectedBadge.reward.type,
                                                                rewardTitle: selectedBadge.reward.title,
                                                            });
                                                            setClaimStatus({ type: 'success', message: 'Badge claimed successfully!' });
                                                            fetchProfileData();
                                                            setTimeout(() => setSelectedBadge(null), 1500);
                                                        } catch (err) {
                                                            setClaimStatus({
                                                                type: 'error',
                                                                message: err.response?.data?.message || 'Could not claim badge'
                                                            });
                                                        } finally {
                                                            setClaiming(false);
                                                        }
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.85rem',
                                                        background: claiming ? 'rgba(34,197,94,0.5)' : '#22c55e',
                                                        border: 'none',
                                                        borderRadius: '10px',
                                                        color: '#fff',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 700,
                                                        cursor: claiming ? 'not-allowed' : 'pointer',
                                                    }}
                                                >
                                                    {claiming ? 'Claiming...' : '🎉 Claim Badge!'}
                                                </motion.button>
                                            </>
                                        );
                                    }

                                    return (
                                        <div style={{
                                            padding: '0.75rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '10px',
                                            color: 'rgba(255,255,255,0.4)',
                                            fontSize: '0.85rem',
                                        }}>
                                            🔒 Complete the task above to unlock
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Your Challenges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={glassStyle}
                >
                    <h2 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>
                        Your Challenges
                    </h2>
                    {loading ? (
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Loading...</p>
                    ) : challenges.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                                You haven't joined any challenges yet.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                            {challenges.map((challenge, i) => (
                                <motion.div
                                    key={challenge._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => navigate(`/challenge/${challenge._id}`)}
                                    style={{
                                        background: 'linear-gradient(rgba(239,68,68,0.08), rgba(239,68,68,0.03))',
                                        border: '1px solid rgba(239,68,68,0.18)',
                                        borderRadius: '14px',
                                        padding: '1.25rem',
                                        cursor: 'pointer',
                                        position: 'relative',
                                    }}
                                >
                                    {/* Delete button */}
                                    
                                    {canDeleteChallenge(challenge) && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '0.75rem',
                                                right: '0.75rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-end',
                                                gap: '0.45rem',
                                                zIndex: 50
                                            }}
                                        >
                                            <div style={{ display: 'flex', gap: '0.45rem' }}>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditChallenge(challenge);
                                                    }}
                                                    style={{
                                                        background: 'rgba(59,130,246,0.15)',
                                                        border: '1px solid rgba(59,130,246,0.2)',
                                                        borderRadius: '6px',
                                                        color: '#3b82f6',
                                                        width: '28px',
                                                        height: '28px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    ✏️
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteConfirm(challenge);
                                                    }}
                                                    style={{
                                                        background: 'rgba(239,68,68,0.15)',
                                                        border: '1px solid rgba(239,68,68,0.2)',
                                                        borderRadius: '6px',
                                                        color: '#ef4444',
                                                        width: '28px',
                                                        height: '28px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem'
                                                    }}
                                                >
                                                    🗑
                                                </motion.button>
                                            </div>

                                            <span style={{
                                                background: 'rgba(197, 60, 60, 0.12)',
                                                color: '#c62d2d',
                                                border: '1px solid rgba(226, 70, 70, 0.22)',
                                                padding: '3px 10px',
                                                borderRadius: '20px',
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                textTransform: 'uppercase'
                                            }}>
                                                {challenge.status}
                                            </span>
                                        </div>
                                    )}
                                

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <span style={{
                                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                            border: '1px solid rgba(239,68,68,0.2)',
                                            padding: '3px 10px', borderRadius: '20px',
                                            fontSize: '11px', fontWeight: 500,
                                        }}>
                                            {challenge.category}
                                        </span>
                                    </div>
                                    <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                                        {challenge.title}
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                                        {challenge.description.length > 60 ? challenge.description.substring(0, 60) + '...' : challenge.description}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                                            {challenge.duration} days
                                        </span>
                                        <span style={{ color: '#ef4444', fontSize: '0.78rem', letterSpacing: '1px' }}>
                                            {challenge.inviteCode}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Logout */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    style={{
                        width: '100%',
                        padding: '0.95rem',
                        background: 'transparent',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '10px',
                        color: '#ef4444',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    Sign out
                </motion.button>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {editChallenge && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => {
                                    setEditChallenge(null);
                                    setEditForm({});
                                    setEditStatus({ type: '', message: '' });
                                }}
                                style={{
                                    position: 'fixed', inset: 0,
                                    background: 'rgba(0,0,0,0.7)',
                                    backdropFilter: 'blur(6px)',
                                    zIndex: 50,
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                style={{
                                    position: 'fixed',
                                    top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'linear-gradient(145deg, #1a1020, #0f1419)',
                                    border: '1px solid rgba(59,130,246,0.2)',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    zIndex: 51,
                                    width: 'min(500px, 90%)',
                                    maxHeight: '85vh',
                                    overflow: 'auto',
                                }}
                                onClick={e => e.stopPropagation()}
                            >
                                <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', margin: 0 }}>
                                    ✏️ Edit Challenge
                                </h2>
                                
                                <form onSubmit={handleSaveChallenge} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {/* Title */}
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
                                            Challenge Title
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.title || ''}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                                            required
                                            style={{
                                                width: '100%',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                borderRadius: '10px',
                                                color: '#fff',
                                                padding: '0.8rem 0.9rem',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                            placeholder="Enter challenge title"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
                                            Description
                                        </label>
                                        <textarea
                                            value={editForm.description || ''}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                                            required
                                            rows="4"
                                            style={{
                                                width: '100%',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                borderRadius: '10px',
                                                color: '#fff',
                                                padding: '0.8rem 0.9rem',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                fontFamily: 'inherit',
                                                resize: 'vertical',
                                            }}
                                            placeholder="Enter challenge description"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
                                            Category
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.category || ''}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                                            required
                                            style={{
                                                width: '100%',
                                                background: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                borderRadius: '10px',
                                                color: '#fff',
                                                padding: '0.8rem 0.9rem',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                            placeholder="e.g., Fitness, Learning, Health"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        {/* Duration */}
                                        <div>
                                            <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
                                                Duration (days)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={editForm.duration || 1}
                                                onChange={(e) => setEditForm((prev) => ({ ...prev, duration: parseInt(e.target.value) || 1 }))}
                                                required
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.12)',
                                                    borderRadius: '10px',
                                                    color: '#fff',
                                                    padding: '0.8rem 0.9rem',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                }}
                                            />
                                        </div>

                                        {/* Start Date */}
                                        <div>
                                            <label style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: '0.4rem' }}>
                                                Start Date
                                            </label>
                                            <input
                                                type="date"
                                                value={editForm.startDate || ''}
                                                onChange={(e) => setEditForm((prev) => ({ ...prev, startDate: e.target.value }))}
                                                required
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.12)',
                                                    borderRadius: '10px',
                                                    color: '#fff',
                                                    padding: '0.8rem 0.9rem',
                                                    outline: 'none',
                                                    boxSizing: 'border-box',
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Public/Private */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <input
                                            type="checkbox"
                                            id="isPublic"
                                            checked={editForm.isPublic}
                                            onChange={(e) => setEditForm((prev) => ({ ...prev, isPublic: e.target.checked }))}
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <label htmlFor="isPublic" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', margin: 0 }}>
                                            Make this challenge public (anyone can join)
                                        </label>
                                    </div>

                                    {/* Status Message */}
                                    {editStatus.message && (
                                        <div
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                background: editStatus.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                                color: editStatus.type === 'success' ? '#22c55e' : '#ef4444',
                                                fontSize: '0.82rem',
                                            }}
                                        >
                                            {editStatus.message}
                                        </div>
                                    )}

                                    {/* Buttons */}
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={editSaving}
                                            style={{
                                                flex: 1,
                                                padding: '0.88rem',
                                                borderRadius: '10px',
                                                border: 'none',
                                                background: editSaving ? 'rgba(59,130,246,0.6)' : '#3b82f6',
                                                color: '#fff',
                                                fontSize: '0.92rem',
                                                fontWeight: 700,
                                                cursor: editSaving ? 'not-allowed' : 'pointer',
                                            }}
                                        >
                                            {editSaving ? 'Saving...' : 'Save Changes'}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={() => {
                                                setEditChallenge(null);
                                                setEditForm({});
                                                setEditStatus({ type: '', message: '' });
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '0.88rem',
                                                borderRadius: '10px',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'transparent',
                                                color: '#fff',
                                                fontSize: '0.92rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Delete Confirmation Modal */}
                <AnimatePresence>
                    {deleteConfirm && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setDeleteConfirm(null)}
                                style={{
                                    position: 'fixed', inset: 0,
                                    background: 'rgba(0,0,0,0.6)',
                                    zIndex: 30,
                                }}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ type: 'spring', bounce: 0.3 }}
                                style={{
                                    position: 'fixed',
                                    top: '50%', left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: '#0f1419',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    zIndex: 31,
                                    width: 'min(380px, 90%)',
                                    textAlign: 'center',
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗑️</div>
                                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    Delete Challenge?
                                </h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    This will permanently delete <span style={{ color: '#ef4444', fontWeight: 600 }}>{deleteConfirm.title}</span> and all its data. This cannot be undone.
                                </p>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => setDeleteConfirm(null)}
                                        style={{
                                            flex: 1, padding: '0.75rem',
                                            background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.15)',
                                            borderRadius: '8px', color: '#fff',
                                            fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleDelete(deleteConfirm._id)}
                                        style={{
                                            flex: 1, padding: '0.75rem',
                                            background: '#ef4444', border: 'none',
                                            borderRadius: '8px', color: '#fff',
                                            fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </motion.button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Profile;

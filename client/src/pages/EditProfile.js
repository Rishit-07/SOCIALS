import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import Particles from '../components/Particles';

const tabs = ['Account', 'Avatar', 'Security'];


const EditProfile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Account');
    const [name, setName] = useState(user?.name || '');
    const [role, setRole] = useState(user?.role || 'Productivity Warrior');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [securityStatus, setSecurityStatus] = useState({ type: '', message: '' });
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [showEmailSuccessDialog, setShowEmailSuccessDialog] = useState(false);
    const [showPasswordSuccessDialog, setShowPasswordSuccessDialog] = useState(false);
    const [showSaveSuccessDialog, setShowSaveSuccessDialog] = useState(false);

    useEffect(() => {
        if (!avatarFile) return;
        const url = URL.createObjectURL(avatarFile);
        setAvatarPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [avatarFile]);

    const handleSave = async () => {
        setSaving(true);
        setSaveStatus({ type: '', message: '' });
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('role', role);
            if (avatarFile) formData.append('avatar', avatarFile);

            const res = await API.put('/api/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const updatedUser = { ...(user || {}), ...(res.data?.user || {}) };
            if (updateUser) updateUser(updatedUser);
            else localStorage.setItem('user', JSON.stringify(updatedUser));

            setSaveStatus({ type: 'success', message: 'Profile updated successfully!' });
            setShowSaveSuccessDialog(true);
            setShowConfirmDialog(false);
            setTimeout(() => {
                setShowSaveSuccessDialog(false);
                navigate('/profile');
            }, 3000);
        } catch (err) {
            setSaveStatus({
                type: 'error',
                message: err.response?.data?.message || 'Failed to save profile',
            });
            setShowConfirmDialog(false);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setUpdatingEmail(true);
    setSecurityStatus({ type: '', message: '' });
    try {
        const res = await API.put('/api/users/update-email', {
            email: newEmail,
            password: emailPassword,
        });
        const updatedUser = { ...(user || {}), ...(res.data?.user || {}) };
        if (updateUser) updateUser(updatedUser);
        else localStorage.setItem('user', JSON.stringify(updatedUser));
        setSecurityStatus({ type: 'success', message: 'Email updated successfully!' });
        setNewEmail('');
        setEmailPassword('');
        setShowEmailSuccessDialog(true);
        setTimeout(() => setShowEmailSuccessDialog(false), 3000);
    } catch (err) {
        setSecurityStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update email' });
    } finally {
        setUpdatingEmail(false);
    }
};

const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSecurityStatus({ type: '', message: '' });
    if (newPassword !== confirmPassword) {
        setSecurityStatus({ type: 'error', message: 'Passwords do not match!' });
        return;
    }
    if (newPassword.length < 6) {
        setSecurityStatus({ type: 'error', message: 'Password must be at least 6 characters' });
        return;
    }
    setUpdatingPassword(true);
    try {
        await API.put('/api/users/update-password', { currentPassword, newPassword });
        setSecurityStatus({ type: 'success', message: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSuccessDialog(true);
        setTimeout(() => setShowPasswordSuccessDialog(false), 3000);
    } catch (err) {
        setSecurityStatus({ type: 'error', message: err.response?.data?.message || 'Failed to update password' });
    } finally {
        setUpdatingPassword(false);
    }
};

    const glassStyle = {
        background: 'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '14px',
        padding: '1.5rem',
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem 1rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
    };

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

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px', margin: '0 auto', padding: '2.5rem 1.5rem 160px' }}>

                {/* Back */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/profile')}
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    ← Back to Profile
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                        Edit Profile
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                        Update your identity and avatar
                    </p>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '4px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        position: 'relative',
                    }}
                >
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1,
                                padding: '0.65rem',
                                background: activeTab === tab ? '#ef4444' : 'transparent',
                                border: 'none',
                                borderRadius: '8px',
                                color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.4)',
                                fontSize: '0.9rem',
                                fontWeight: activeTab === tab ? 600 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                position: 'relative',
                                zIndex: 1,
                            }}
                        >
                            {tab === 'Account' ? '👤 Account' : tab === 'Avatar' ? '🖼️ Avatar' : '🔐 Security'}
                        </button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">

                    {/* Account Tab */}
                    {activeTab === 'Account' && (
                        <motion.div
                            key="account"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.25 }}
                            style={{ ...glassStyle, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        >
                            <div>
                                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Your name"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#ef4444'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                />
                            </div>
                            <div>
                                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                    Role / Title
                                </label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    placeholder="e.g. Productivity Warrior"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = '#ef4444'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                />
                            </div>
                            <div>
                                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    style={{ ...inputStyle, opacity: 0.4, cursor: 'not-allowed' }}
                                />
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                                    Email cannot be changed
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Avatar Tab */}
                    {activeTab === 'Avatar' && (
                        <motion.div
                            key="avatar"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                            style={{ ...glassStyle, display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center' }}
                        >
                            {/* Avatar Preview */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', bounce: 0.4 }}
                                style={{
                                    width: '120px', height: '120px', borderRadius: '50%',
                                    border: '3px solid rgba(239,68,68,0.4)',
                                    overflow: 'hidden',
                                    background: 'rgba(239,68,68,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : user?.avatar ? (
                                    <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ color: '#ef4444', fontSize: '2.5rem', fontWeight: 700 }}>
                                        {user?.name?.[0]?.toUpperCase()}
                                    </span>
                                )}
                            </motion.div>

                            <div style={{ width: '100%' }}>
                                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                    Upload Avatar
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                                    style={{ ...inputStyle, color: 'rgba(255,255,255,0.6)', padding: '0.65rem 1rem' }}
                                />
                                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                                    JPG, PNG or GIF — max 5MB
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'Security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25 }}
                            style={{ ...glassStyle, display: 'flex', flexDirection: 'column', gap: '2rem' }}
                        >
                            {/* Update Email Section */}
                            <div>
                                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Update Email</h3>
                                <form onSubmit={handleUpdateEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                            New Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={e => setNewEmail(e.target.value)}
                                            placeholder="Enter new email"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = '#ef4444'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                            Confirm with Password
                                        </label>
                                        <input
                                            type="password"
                                            value={emailPassword}
                                            onChange={e => setEmailPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = '#ef4444'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            required
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={updatingEmail || !newEmail || !emailPassword}
                                        style={{
                                            padding: '0.8rem',
                                            background: updatingEmail ? 'rgba(239,68,68,0.5)' : '#ef4444',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            cursor: updatingEmail ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {updatingEmail ? 'Updating...' : 'Update Email'}
                                    </motion.button>
                                </form>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

                            {/* Update Password Section */}
                            <div>
                                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem' }}>Update Password</h3>
                                <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={e => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = '#ef4444'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="Enter new password (min 6 characters)"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = '#ef4444'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            style={inputStyle}
                                            onFocus={e => e.target.style.borderColor = '#ef4444'}
                                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                                            required
                                        />
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={updatingPassword || !currentPassword || !newPassword || !confirmPassword}
                                        style={{
                                            padding: '0.8rem',
                                            background: updatingPassword ? 'rgba(239,68,68,0.5)' : '#ef4444',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            cursor: updatingPassword ? 'not-allowed' : 'pointer',
                                        }}
                                    >
                                        {updatingPassword ? 'Updating...' : 'Update Password'}
                                    </motion.button>
                                </form>
                            </div>

                            {/* Security Status */}
                            <AnimatePresence>
                                {securityStatus.message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            background: securityStatus.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                            border: `1px solid ${securityStatus.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                            color: securityStatus.type === 'success' ? '#22c55e' : '#ef4444',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        {securityStatus.message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                    
                </AnimatePresence>

                {/* Save Status */}
                <AnimatePresence>
                    {saveStatus.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{
                                marginTop: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                background: saveStatus.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                border: `1px solid ${saveStatus.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                color: saveStatus.type === 'success' ? '#22c55e' : '#ef4444',
                                fontSize: '0.85rem',
                            }}
                        >
                            {saveStatus.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Save Button - Only show for Account and Avatar tabs */}
                {activeTab !== 'Security' && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowConfirmDialog(true)}
                        style={{
                            width: '100%',
                            marginTop: '1.25rem',
                            padding: '0.95rem',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Save Changes
                    </motion.button>
                )}
            </div>

            {/* Family-style Confirm Dialog */}
            <AnimatePresence>
                {showConfirmDialog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowConfirmDialog(false)}
                            style={{
                                position: 'fixed', inset: 0,
                                background: 'rgba(0,0,0,0.65)',
                                backdropFilter: 'blur(6px)',
                                zIndex: 100,
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 30 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                            style={{
                                position: 'fixed',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'linear-gradient(145deg, #1a1020, #0f1419)',
                                border: '1px solid rgba(239,68,68,0.25)',
                                borderRadius: '20px',
                                padding: '2rem',
                                zIndex: 101,
                                width: 'min(400px, 90%)',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                            }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                                style={{
                                    width: '52px', height: '52px',
                                    borderRadius: '14px',
                                    background: 'rgba(239,68,68,0.15)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.5rem', marginBottom: '1rem',
                                }}
                            >
                                💾
                            </motion.div>

                            <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                Save Changes?
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                                You're about to update your profile details. This will reflect across the entire app immediately.
                            </p>

                            {/* Summary */}
                            <div style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '10px',
                                padding: '0.85rem 1rem',
                                marginBottom: '1.5rem',
                                display: 'flex', flexDirection: 'column', gap: '0.4rem',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>Name</span>
                                    <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 500 }}>{name}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>Role</span>
                                    <span style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 500 }}>{role}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>Avatar</span>
                                    <span style={{ color: avatarFile ? '#22c55e' : 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>
                                        {avatarFile ? '✓ New image selected' : 'No change'}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setShowConfirmDialog(false)}
                                    style={{
                                        flex: 1, padding: '0.8rem',
                                        background: 'transparent',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '10px', color: '#fff',
                                        fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{
                                        flex: 1, padding: '0.8rem',
                                        background: saving ? 'rgba(239,68,68,0.5)' : '#ef4444',
                                        border: 'none',
                                        borderRadius: '10px', color: '#fff',
                                        fontSize: '0.9rem', fontWeight: 600,
                                        cursor: saving ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {saving ? 'Saving...' : 'Yes, Save'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Email Success Dialog */}
            <AnimatePresence>
                {showEmailSuccessDialog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed', inset: 0,
                                background: 'rgba(0,0,0,0.65)',
                                backdropFilter: 'blur(6px)',
                                zIndex: 100,
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 50 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            style={{
                                position: 'fixed',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'linear-gradient(145deg, #1a1020, #0f1419)',
                                border: '1px solid rgba(34,197,94,0.3)',
                                borderRadius: '20px',
                                padding: '2rem',
                                zIndex: 101,
                                width: 'min(400px, 90%)',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                                textAlign: 'center',
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', bounce: 0.6, delay: 0.1 }}
                                style={{
                                    width: '64px', height: '64px',
                                    borderRadius: '50%',
                                    background: 'rgba(34,197,94,0.15)',
                                    border: '2px solid rgba(34,197,94,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', marginBottom: '1rem',
                                    margin: '0 auto 1rem',
                                }}
                            >
                                ✓
                            </motion.div>
                            <h3 style={{ color: '#22c55e', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                Email Updated
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Your email has been successfully updated. Please verify if you receive a confirmation email.
                            </p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Password Success Dialog */}
            <AnimatePresence>
                {showPasswordSuccessDialog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed', inset: 0,
                                background: 'rgba(0,0,0,0.65)',
                                backdropFilter: 'blur(6px)',
                                zIndex: 100,
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 50 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            style={{
                                position: 'fixed',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'linear-gradient(145deg, #1a1020, #0f1419)',
                                border: '1px solid rgba(34,197,94,0.3)',
                                borderRadius: '20px',
                                padding: '2rem',
                                zIndex: 101,
                                width: 'min(400px, 90%)',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                                textAlign: 'center',
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', bounce: 0.6, delay: 0.1 }}
                                style={{
                                    width: '64px', height: '64px',
                                    borderRadius: '50%',
                                    background: 'rgba(34,197,94,0.15)',
                                    border: '2px solid rgba(34,197,94,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', marginBottom: '1rem',
                                    margin: '0 auto 1rem',
                                }}
                            >
                                🔐
                            </motion.div>
                            <h3 style={{ color: '#22c55e', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                Password Updated
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Your password has been successfully changed. Keep it secure!
                            </p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Save Success Dialog */}
            <AnimatePresence>
                {showSaveSuccessDialog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed', inset: 0,
                                background: 'rgba(0,0,0,0.65)',
                                backdropFilter: 'blur(6px)',
                                zIndex: 100,
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 50 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            style={{
                                position: 'fixed',
                                top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'linear-gradient(145deg, #1a1020, #0f1419)',
                                border: '1px solid rgba(34,197,94,0.3)',
                                borderRadius: '20px',
                                padding: '2rem',
                                zIndex: 101,
                                width: 'min(400px, 90%)',
                                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
                                textAlign: 'center',
                            }}
                        >
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', bounce: 0.6, delay: 0.1 }}
                                style={{
                                    width: '64px', height: '64px',
                                    borderRadius: '50%',
                                    background: 'rgba(34,197,94,0.15)',
                                    border: '2px solid rgba(34,197,94,0.5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '2rem', marginBottom: '1rem',
                                    margin: '0 auto 1rem',
                                }}
                            >
                                💾
                            </motion.div>
                            <h3 style={{ color: '#22c55e', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                Changes Saved
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Your profile has been successfully updated. Redirecting...
                            </p>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditProfile;
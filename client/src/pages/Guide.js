import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import Particles from '../components/Particles';

const GUIDE_SECTIONS = [
    {
        marker: '01',
        title: 'Join a challenge',
        accent: '#69a970',
        summary: 'Every challenge has an invite code. Copy the code from the creator and paste it into the Join a challenge box on your Dashboard.',
        steps: [
            'Ask the challenge creator for the invite code.',
            'Or the invite code will be availible on the challenge header in bold red text.(with random letters or numbers)',
            'Go to your Dashboard.',
            'Paste the invite code into the Join a challenge box.',
            'Click Join.',
        ],
    },
    {
        marker: '02',
        title: 'Public or private',
        accent: '#706eee',
        summary: 'Public and private challenges both use invite codes. The difference is what happens after you enter the code.',
        steps: [
            'Public challenge: you join immediately after entering the invite code.',
            'Private challenge: your request is sent to the creator.',
            'For private challenges, wait until the creator approves you.',
            'After approval, the challenge appears in Your Active Challenges.',
        ],
    },
    {
        marker: '03',
        title: 'Create a challenge',
        accent: '#f59e0b',
        summary: 'When you create a challenge, you automatically join it as the creator. You do not need to enter your own invite code.',
        steps: [
            'Open Create Challenge.',
            'Add the title, description, category, and duration.',
            'Choose public if users can join instantly, or private if you want approval control.',
            'Create it, then share the invite code with people you want to invite.',
        ],
    },
    {
        marker: '04',
        title: 'Check in daily',
        accent: '#8b5cf6',
        summary: 'After joining, open the challenge from Your Active Challenges and submit your daily progress.',
        steps: [
            'Open your joined challenge.',
            'Write a short daily note.',
            'Submit your check-in.',
            'Track your streak, leaderboard, rewards, and participants.',
        ],
    },
    {
        marker: '05',
        title: 'Leaving a challenge(if joined a challenge)',
        accent: '#f67ff4',
        summary: 'After joining, one can leave the challenge on their own free will.',
        steps: [
            'Navigate back to home.',
            'Under the Active Challenge section.',
            'Click on the Leave Challenge button.',
            'Confirm that you want to leave the challenge.',
        ],
    },
    {
        marker: '06',
        title: 'Deleting a challenge(Only possible if you are the creator)',
        accent: '#7ec0ed',
        summary: 'Challenge creators can delete their challenges, which removes them for all participants.',
        steps: [
            'Navigate to the profile page',
            'Under the Your Challenge section.',
            'Click on the Delete Challenge button.',
            'Confirm that you want to delete the challenge.',
        ],
    },
];

const Guide = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 26, scale: 0.97, filter: 'blur(5px)' },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
    };

    const goToAction = () => {
        navigate(user ? '/dashboard' : '/register');
    };

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#0f1419', position: 'relative', overflowX: 'hidden' }}>
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <Particles
                    particleCount={150}
                    particleSpread={16}
                    speed={0.045}
                    particleColors={['#ffffff', '#f3f4f6', '#ccfbf1']}
                    moveParticlesOnHover={true}
                    particleHoverFactor={2}
                    alphaParticles={true}
                    particleBaseSize={105}
                    sizeRandomness={1.25}
                />
            </div>

            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    top: '1.5rem',
                    left: '1.5rem',
                    zIndex: 50,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '10px',
                    color: 'rgba(255,255,255,0.78)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    padding: '0.6rem 1rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                }}
            >
                Home
            </motion.button>

            <main style={{ position: 'relative', zIndex: 10, maxWidth: '1040px', margin: '0 auto', padding: '7rem 1.5rem 8rem' }}>
                <section style={{ minHeight: '58vh', display: 'grid', alignItems: 'center', gap: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65 }}
                        style={{ textAlign: 'center' }}
                    >

                        <p style={{ color: '#b81414', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
                            User Guide
                        </p>
                        <h1 style={{ color: '#fff', fontSize: 'clamp(2.4rem, 7vw, 5.4rem)', fontWeight: 800, lineHeight: 1, marginBottom: '1rem' }}>
                            How Socials Works
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '1rem', lineHeight: 1.75, maxWidth: '720px', margin: '0 auto 1.75rem' }}>
                            Learn how to join with invite codes, understand public and private challenges, create your own challenge, and keep your streak alive.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={goToAction}
                                style={{
                                    padding: '0.85rem 1.25rem',
                                    background: '#ef4444',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '0.92rem',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                }}
                            >
                                {user ? 'Open Dashboard' : 'Get Started'}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.04, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/about')}
                                style={{
                                    padding: '0.85rem 1.25rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.14)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '0.92rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                About Socials
                            </motion.button>
                        </div>
                    </motion.div>
                </section>

                <motion.section
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.18 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1rem' }}
                >
                    {GUIDE_SECTIONS.map((section) => (
                        <motion.article
                            key={section.title}
                            variants={cardVariants}
                            whileHover={{ y: -6, borderColor: section.accent }}
                            style={{
                                minHeight: '360px',
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025))',
                                border: '1px solid rgba(255,255,255,0.11)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <motion.div
                                animate={{ x: ['-35%', '135%'] }}
                                transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '45%',
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${section.accent}, transparent)`,
                                }}
                            />

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <span style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '14px',
                                    background: `${section.accent}22`,
                                    border: `1px solid ${section.accent}55`,
                                    color: section.accent,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 900,
                                }}>
                                    {section.marker}
                                </span>
                                <span style={{ color: section.accent, fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.3px' }}>
                                    Guide
                                </span>
                            </div>

                            <h2 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.65rem' }}>
                                {section.title}
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.56)', fontSize: '0.88rem', lineHeight: 1.65, marginBottom: '1rem' }}>
                                {section.summary}
                            </p>

                            <div style={{ display: 'grid', gap: '0.7rem' }}>
                                {section.steps.map((step, index) => (
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: '0.65rem', alignItems: 'start' }}
                                    >
                                        <span style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '999px',
                                            background: `${section.accent}1f`,
                                            border: `1px solid ${section.accent}45`,
                                            color: section.accent,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.75rem',
                                            fontWeight: 900,
                                        }}>
                                            {index + 1}
                                        </span>
                                        <p style={{ color: 'rgba(255,255,255,0.74)', fontSize: '0.84rem', lineHeight: 1.55, paddingTop: '0.22rem' }}>
                                            {step}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.article>
                    ))}
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.55 }}
                    style={{
                        marginTop: '1rem',
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.13), rgba(20,184,166,0.09))',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <h2 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                            Ready to try it?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                            Join from the Dashboard with an invite code, or create a challenge and invite others.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={goToAction}
                        style={{
                            padding: '0.85rem 1.25rem',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '0.92rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                        }}
                    >
                        {user ? 'Go to Dashboard' : 'Create Account'}
                    </motion.button>
                </motion.section>
            </main>
        </div>
    );
};

export default Guide;

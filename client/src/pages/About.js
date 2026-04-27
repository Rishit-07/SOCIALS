import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CardSwap, { Card } from '../components/CardSwap';
import Particles from '../components/Particles';

const FEATURE_CARDS = [
    {
        icon: '🎯',
        title: 'Create Challenges',
        desc: 'Set a goal — 7 days, 14 days, 30 days. Define the rules. Make it yours.',
        tag: 'Goals',
        color: 'rgba(239,68,68,0.15)',
        border: 'rgba(239,68,68,0.3)',
        tagColor: '#ef4444',
    },
    {
        icon: '🔒',
        title: 'Public or Private',
        desc: 'Open your challenge to the world or keep it invite-only with a secret code.',
        tag: 'Privacy',
        color: 'rgba(168,85,247,0.15)',
        border: 'rgba(168,85,247,0.3)',
        tagColor: '#a855f7',
    },
    {
        icon: '✅',
        title: 'Daily Check-ins',
        desc: 'Show up every day. Log your progress with a note. Build your streak.',
        tag: 'Consistency',
        color: 'rgba(34,197,94,0.15)',
        border: 'rgba(34,197,94,0.3)',
        tagColor: '#22c55e',
    },
    {
        icon: '🏆',
        title: 'Leaderboard',
        desc: 'See who is leading in real-time. Compete, compare, and push harder.',
        tag: 'Competition',
        color: 'rgba(234,179,8,0.15)',
        border: 'rgba(234,179,8,0.3)',
        tagColor: '#eab308',
    },
    {
        icon: '💬',
        title: 'Group Chat',
        desc: 'Talk to your team inside every challenge. Real-time messaging powered by Socket.io.',
        tag: 'Community',
        color: 'rgba(59,130,246,0.15)',
        border: 'rgba(59,130,246,0.3)',
        tagColor: '#3b82f6',
    },
    {
        icon: '🃏',
        title: 'Card Rarity System',
        desc: 'Your profile card evolves as you win. Common → Rare → Epic → Legendary → Mythic.',
        tag: 'Gamification',
        color: 'rgba(251,146,60,0.15)',
        border: 'rgba(251,146,60,0.3)',
        tagColor: '#fb923c',
    },
];

const STATS = [
    { value: '5', label: 'Rarity Tiers' },
    { value: '∞', label: 'Challenges' },
    { value: '24/7', label: 'Real-time' },
    { value: '0', label: 'Excuses' },
];

const About = () => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', width: '100%', background: '#0f1419', position: 'relative', overflowX: 'hidden' }}>
            {/* Particles */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Particles
                    particleCount={120}
                    particleSpread={15}
                    speed={0.04}
                    particleColors={['#ffffff', '#f3f4f6']}
                    moveParticlesOnHover={true}
                    particleHoverFactor={2}
                    alphaParticles={true}
                    particleBaseSize={100}
                    sizeRandomness={1.2}
                />
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Back button */}
<motion.button
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    onClick={() => navigate('/')}
    style={{
        position: 'fixed',
        top: '1.5rem',
        left: '1.5rem',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '0.85rem',
        fontWeight: 500,
        padding: '0.6rem 1rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 50,
        backdropFilter: 'blur(8px)',
    }}
>
    ← Home
</motion.button>

                {/* Hero Section */}
                <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                            style={{
                                display: 'inline-block',
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                borderRadius: '20px',
                                padding: '6px 16px',
                                color: '#ef4444',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                marginBottom: '1.5rem',
                            }}
                        >
                             What is Socials?
                        </motion.div>

                       <h1 style={{
    color: '#fff',
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: 800,
    fontFamily: "'Open Sans', sans-serif",
    lineHeight: 1.1,
    marginBottom: '1.25rem',
    maxWidth: '800px',
}}>
    Productivity is{' '}
    <span style={{
        background: 'linear-gradient(90deg, #B22222 , #E9967A)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        fontFamily: "'Open Sans', sans-serif",
    }}>
        better together.
    </span>
</h1>

                        <p style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '1.1rem',
                            lineHeight: 1.7,
                            maxWidth: '600px',
                            margin: '0 auto 2.5rem',
                        }}>
                            Socials turns your goals into shared challenges. Create, compete, check in daily, and watch your profile card evolve as you win. No more going it alone.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/register')}
                                style={{
                                    padding: '0.9rem 2rem',
                                    background: '#ef4444',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Get started →
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/login')}
                                style={{
                                    padding: '0.9rem 2rem',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                            >
                                Sign in
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Scroll hint */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 8, 0] }}
                        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
                        style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}
                    >
                        scroll to explore ↓
                    </motion.div>
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1px',
                        background: 'rgba(255,255,255,0.06)',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        marginBottom: '6rem',
                    }}
                >
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                padding: '2.5rem 1rem',
                                textAlign: 'center',
                                background: '#0f1419',
                            }}
                        >
                            <div style={{ color: '#ef4444', fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
                                {stat.value}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CardSwap Feature Section */}
                <div style={{ padding: '0 2rem 8rem', maxWidth: '1100px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ marginBottom: '4rem', textAlign: 'center' }}
                    >
                        <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', fontFamily: "'Open Sans', sans-serif",}}>
                            Everything you need to{' '}
                            <span style={{ background: 'linear-gradient(90deg, #ef4444, #fb923c)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontFamily: "'Open Sans', sans-serif", }}>
                                stay locked in.
                            </span>
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', fontFamily: "'Open Sans', sans-serif", }}>
                            Six core features designed to keep you accountable, competitive, and consistent.
                        </p>
                    </motion.div>

                    {/* CardSwap */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap' }}>

                        {/* Left — description */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ maxWidth: '360px', flex: '1 1 300px' }}
                        >
                            <h3 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.3 }}>
                                Six features.<br />
                                <span style={{ color: '#ef4444' }}>One platform.</span>
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                                From creating your first challenge to earning a Mythic profile card — everything is built to reward consistency and effort.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {FEATURE_CARDS.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '8px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 500 }}>{f.title}</span>
                                        <span style={{ marginLeft: 'auto', color: f.tagColor, fontSize: '0.72rem', fontWeight: 600 }}>{f.tag}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right — CardSwap */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ position: 'relative', width: '380px', height: '420 px', flex: '0 0 380px' }}
                        >
                            <div style={{ position: 'relative', width: '320px', height: '350px' }}></div>
                            <CardSwap
                                 width={320}
                                    height={240}
                                    cardDistance={40}
                                    verticalDistance={30}
                                    delay={3000}
                                    pauseOnHover={true}
                                    skewAmount={3}
                                    easing="elastic"
                            >
                                {FEATURE_CARDS.map((f, i) => (
                                   <Card
    key={i}
    style={{
        background: `linear-gradient(135deg, ${f.color}, rgba(15,20,25,0.95))`,
        border: `1px solid ${f.border}`,
        borderRadius: '16px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        boxSizing: 'border-box',
        overflow: 'hidden',
    }}
>
    <div style={{ fontSize: '1.8rem' }}>{f.icon}</div>
    <div>
        <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.08)',
            color: f.tagColor,
            padding: '2px 8px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 700,
            marginBottom: '0.4rem',
        }}>
            {f.tag}
        </div>
        <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.3rem' }}>
            {f.title}
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', lineHeight: 1.5, margin: 0 }}>
            {f.desc}
        </p>
    </div>
</Card>
                                ))}
                            </CardSwap>
                        </motion.div>
                    </div>
                </div>

                {/* Rarity Progression Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        padding: '5rem 2rem',
                        textAlign: 'center',
                        marginBottom: '6rem',
                    }}
                >
                    <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem' }}>
                        Your card evolves as you win.
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', marginBottom: '3rem' }}>
                        Five rarity tiers. Each one harder to earn than the last.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', maxWidth: '800px', margin: '0 auto' }}>
                        {[
                            { rarity: 'Common', icon: '⭐', color: '#a0a0a0', bg: 'rgba(180,180,180,0.1)', border: 'rgba(180,180,180,0.3)' },
                            { rarity: 'Rare', icon: '⚡', color: '#60a5fa', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
                            { rarity: 'Epic', icon: '🔥', color: '#fb923c', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
                            { rarity: 'Legendary', icon: '👑', color: '#facc15', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
                            { rarity: 'Mythic', icon: '✦', color: '#c084fc', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)' },
                        ].map((tier, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, type: 'spring', bounce: 0.4 }}
                                whileHover={{ scale: 1.08, y: -4 }}
                                style={{
                                    background: tier.bg,
                                    border: `1px solid ${tier.border}`,
                                    borderRadius: '14px',
                                    padding: '1.25rem 1.5rem',
                                    minWidth: '120px',
                                    cursor: 'default',
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{tier.icon}</div>
                                <div style={{ color: tier.color, fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                                    {tier.rarity}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem', marginTop: '2rem' }}>
                        Win challenges → earn rewards → unlock higher rarity
                    </p>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', padding: '0 2rem 10rem' }}
                >
                    <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem' }}>
                        Ready to compete?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', marginBottom: '2rem' }}>
                        Join Socials and start your first challenge today.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/register')}
                        style={{
                            padding: '1rem 2.5rem',
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '12px',
                            color: '#fff',
                            fontSize: '1rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 0 30px rgba(239,68,68,0.3)',
                        }}
                    >
                        Create your account →
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
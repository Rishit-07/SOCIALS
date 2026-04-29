import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const sectionStyle = {
  background: 'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: '14px',
  padding: '1rem 1.1rem',
};

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#0f1419', color: '#fff', padding: '2.2rem 1.1rem 8rem' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          style={{
            marginBottom: '1rem',
            padding: '0.55rem 0.85rem',
            background: 'rgba(239,68,68,0.16)',
            border: '1px solid rgba(239,68,68,0.35)',
            color: '#ef4444',
            borderRadius: '9px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.13), rgba(255,255,255,0.02))',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '16px',
            padding: '1.3rem',
            marginBottom: '1rem',
          }}
        >
          <h1 style={{ margin: '0 0 0.35rem', fontSize: '1.6rem' }}>Privacy Policy</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)' }}>
            Your privacy matters to us. This page explains what we collect and why.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ display: 'grid', gap: '0.8rem' }}>
          <section style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>Information We Collect</h3>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.72)' }}>
              We collect account details like name, email, and profile content you choose to provide.
            </p>
          </section>
          <section style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>How We Use Data</h3>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.72)' }}>
              We use your data to run challenges, improve your experience, and keep your account secure.
            </p>
          </section>
          <section style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>Security</h3>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.72)' }}>
              We use reasonable safeguards to protect your account and personal information.
            </p>
          </section>
          <section style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>Your Choices</h3>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.72)' }}>
              You can update profile details, control shared content, and request account removal where applicable.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;

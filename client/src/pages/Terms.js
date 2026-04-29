import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const sectionStyle = {
  background: 'linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
  border: '1px solid rgba(255,255,255,0.11)',
  borderRadius: '14px',
  padding: '1rem 1.1rem',
};

const Terms = () => {
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
          Back to Landing
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
          <h1 style={{ margin: '0 0 0.35rem', fontSize: '1.6rem' }}>Terms of Service</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.65)' }}>
            By using Socials, you agree to these core platform terms.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ display: 'grid', gap: '0.8rem' }}>
          <section style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>Acceptable Use</h3>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.72)' }}>
              Use the platform respectfully and avoid harmful, abusive, or fraudulent behavior.
            </p>
          </section>
          <section style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>Account Responsibility</h3>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.72)' }}>
              You are responsible for keeping your login credentials secure and activity under your account.
            </p>
          </section>
          <section style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>Challenge Content</h3>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.72)' }}>
              You own your content, but grant Socials permission to display it for platform functionality.
            </p>
          </section>
          <section style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>Updates</h3>
            <p style={{ marginBottom: 0, color: 'rgba(255,255,255,0.72)' }}>
              We may update these terms as the app evolves. Continued use means you accept updates.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;

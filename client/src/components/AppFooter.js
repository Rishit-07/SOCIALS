import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const FooterLink = ({ to, children }) => {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest: { y: 0 },
        hover: { y: -1 },
      }}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Link
        to={to}
        style={{
          color: '#ef4444',
          textDecoration: 'none',
          fontSize: '0.78rem',
          fontWeight: 600,
        }}
      >
        {children}
      </Link>
      <motion.div
        variants={{
          rest: { width: 0, opacity: 0.65 },
          hover: { width: '100%', opacity: 1 },
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{
          height: '1.5px',
          marginTop: '2px',
          background: '#ef4444',
          borderRadius: '999px',
        }}
      />
    </motion.div>
  );
};

const AppFooter = ({ isAuthenticated }) => {
  const { pathname } = useLocation();

  return (
    <motion.footer
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        position: 'fixed',
        left: '30%',
        transform: 'translateX(-50%)',
        bottom: isAuthenticated ? '76px' : '14px',
        width: 'min(780px, calc(100% - 1.5rem))',
        zIndex: 70,
        background: 'linear-gradient(rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        padding: '0.6rem 0.9rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          width: '100%',
          gap: '0.8rem',
        }}
      >
        <p
          style={{
            color: 'rgba(255,255,255,0.72)',
            margin: 0,
            fontSize: '0.78rem',
            letterSpacing: '0.2px',
            textAlign: 'left',
            justifySelf: 'start',
          }}
        >
          <span style={{ fontFamily: '"Fjalla One", sans-serif',fontSize: '0.9rem'  
          }}>Join Thousands.Achieve Together</span>
        </p>
         <p
          style={{
            color: 'rgba(255,255,255,0.72)',
            margin: 0,
            fontSize: '0.78rem',
            letterSpacing: '0.2px',
            textAlign: 'center',
            justifySelf: 'center',
          }}
        >
          <span style={{ fontSize: '0.9rem'  
          }}>@2026 Socials</span>
        </p>

        <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', justifySelf: 'end' }}>
          <FooterLink to="/privacy">Privacy</FooterLink>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem',alignItems:'center' }}>|</span>
          <FooterLink to="/terms">Terms</FooterLink>
        </div>
      </div>
    </motion.footer>
  );
};

export default AppFooter;
;
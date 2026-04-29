import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AppFooter.css';

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
      className="app-footer-link-shell"
    >
      <Link
        to={to}
        className="app-footer-link"
      >
        {children}
      </Link>
      <motion.div
        variants={{
          rest: { width: 0, opacity: 0.65 },
          hover: { width: '100%', opacity: 1 },
        }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="app-footer-link-underline"
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
      className={`app-footer ${isAuthenticated ? 'app-footer-authenticated' : ''}`}
    >
      <div className="app-footer-inner">
        <p className="app-footer-tagline">
          <span>Join Thousands. Achieve Together</span>
        </p>
         <p className="app-footer-copyright">
          <span>@2026 Socials</span>
        </p>

        <div className="app-footer-nav">
          <FooterLink to="/privacy">Privacy</FooterLink>
          <span className="app-footer-divider">|</span>
          <FooterLink to="/terms">Terms</FooterLink>
        </div>
      </div>
    </motion.footer>
  );
};

export default AppFooter;

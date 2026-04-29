import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DockContext } from '../context/DockContext';

const DockHint = () => {
  const { showDock } = useContext(DockContext);
  const location = useLocation();

  // Don't show hint on landing, login, or register pages
  const excludePages = ['/', '/login', '/register'];
  if (excludePages.includes(location.pathname)) {
    return null;
  }

  return (
    <AnimatePresence>
      {!showDock && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '44%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '0.85rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(10px)',
            }}
          >
            ↓ Hover cursor here for navigation
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DockHint;

import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DockContext } from '../context/DockContext';
import './DockHint.css';

const DockHint = () => {
  const { showDock } = useContext(DockContext);
  const location = useLocation();

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
          className="dock-hint"
        >
          <div className="dock-hint-bubble">
            Hover cursor here for navigation
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DockHint;

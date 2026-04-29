import { createContext, useState, useCallback } from 'react';

export const DockContext = createContext();

export const DockProvider = ({ children }) => {
  const [showDock, setShowDock] = useState(false);

  const updateDockVisibility = useCallback((isVisible) => {
    setShowDock(isVisible);
  }, []);

  return (
    <DockContext.Provider value={{ showDock, updateDockVisibility }}>
      {children}
    </DockContext.Provider>
  );
};

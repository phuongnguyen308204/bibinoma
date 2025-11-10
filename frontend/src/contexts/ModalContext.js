import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext({
  currentModal: null,
  openModal: () => {},
  closeModal: () => {},
  closeAllModals: () => {}
});

export function ModalProvider({ children }) {
  const [currentModal, setCurrentModal] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const openModal = useCallback((modalData) => {
    if (currentModal) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentModal(modalData);
        setIsAnimating(false);
      }, 200); 
    } else {
      setCurrentModal(modalData);
    }
  }, [currentModal]);

  const closeModal = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentModal(null);
      setIsAnimating(false);
    }, 200);
  }, []);

  const closeAllModals = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentModal(null);
      setIsAnimating(false);
    }, 200);
  }, []);

  return (
    <ModalContext.Provider value={{
      currentModal,
      openModal,
      closeModal,
      closeAllModals,
      isAnimating
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

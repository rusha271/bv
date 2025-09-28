'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isPrivacyModalOpen: boolean;
  isTermsModalOpen: boolean;
  isContactModalOpen: boolean;
  openPrivacyModal: () => void;
  openTermsModal: () => void;
  openContactModal: () => void;
  closePrivacyModal: () => void;
  closeTermsModal: () => void;
  closeContactModal: () => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const openTermsModal = () => setIsTermsModalOpen(true);
  const openContactModal = () => setIsContactModalOpen(true);

  const closePrivacyModal = () => setIsPrivacyModalOpen(false);
  const closeTermsModal = () => setIsTermsModalOpen(false);
  const closeContactModal = () => setIsContactModalOpen(false);

  const closeAllModals = () => {
    setIsPrivacyModalOpen(false);
    setIsTermsModalOpen(false);
    setIsContactModalOpen(false);
  };

  const value: ModalContextType = {
    isPrivacyModalOpen,
    isTermsModalOpen,
    isContactModalOpen,
    openPrivacyModal,
    openTermsModal,
    openContactModal,
    closePrivacyModal,
    closeTermsModal,
    closeContactModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

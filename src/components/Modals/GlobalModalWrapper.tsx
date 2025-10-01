'use client';

import React from 'react';
import { useGlobalTheme } from '@/contexts/GlobalThemeContext';
import { useModalContext } from '@/contexts/ModalContext';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import TermsOfServiceModal from './TermsOfServiceModal';
import ContactUsModal from './ContactUsModal';

const GlobalModalWrapper: React.FC = () => {
  const { theme, isDarkMode, isLightMode } = useGlobalTheme();
  const {
    isPrivacyModalOpen,
    isTermsModalOpen,
    isContactModalOpen,
    closePrivacyModal,
    closeTermsModal,
    closeContactModal,
  } = useModalContext();

  return (
    <>
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={closePrivacyModal}
        theme={theme}
      />
      
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={closeTermsModal}
        theme={theme}
      />
      
      <ContactUsModal
        isOpen={isContactModalOpen}
        onClose={closeContactModal}
        theme={theme}
      />
    </>
  );
};

export default GlobalModalWrapper;

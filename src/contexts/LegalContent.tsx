"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LegalContextType {
  showTerms: boolean;
  showPrivacy: boolean;
  setShowTerms: (show: boolean) => void;
  setShowPrivacy: (show: boolean) => void;
}

const LegalContext = createContext<LegalContextType | undefined>(undefined);

interface LegalProviderProps {
  children: ReactNode;
}

export const LegalProvider: React.FC<LegalProviderProps> = ({ children }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const value: LegalContextType = {
    showTerms,
    showPrivacy,
    setShowTerms,
    setShowPrivacy,
  };

  return (
    <LegalContext.Provider value={value}>
      {children}
    </LegalContext.Provider>
  );
};

export const useLegal = (): LegalContextType => {
  const context = useContext(LegalContext);
  if (context === undefined) {
    throw new Error('useLegal must be used within a LegalProvider');
  }
  return context;
}; 
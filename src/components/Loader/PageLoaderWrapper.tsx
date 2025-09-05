'use client';

import React from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import PageLoader from './PageLoader';

const PageLoaderWrapper: React.FC = () => {
  const { isLoading } = useLoading();
  
  return <PageLoader loading={isLoading} />;
};

export default PageLoaderWrapper;

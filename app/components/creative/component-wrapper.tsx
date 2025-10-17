import React, { useState } from 'react';
import ErrorBoundary from './error-boundary';
import { CreativeToast } from './toast';

interface CreativeComponentWrapperProps {
  children: React.ReactNode;
  componentName: string;
}

export const CreativeComponentWrapper: React.FC<CreativeComponentWrapperProps> = ({ 
  children,
  componentName 
}) => {
  const [key, setKey] = useState(0);
  
  const handleReset = () => {
    // Reset the component by changing its key
    setKey(prevKey => prevKey + 1);
    CreativeToast.info(`Resetting ${componentName} component`);
  };
  
  return (
    <ErrorBoundary
      key={key}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
};
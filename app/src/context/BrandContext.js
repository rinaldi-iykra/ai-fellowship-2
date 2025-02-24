import React, { createContext, useState, useContext, useEffect } from 'react';

export const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] = useState(() => {
    return sessionStorage.getItem('selectedBrand') || 'Adidas';
  });

  useEffect(() => {
    sessionStorage.setItem('selectedBrand', selectedBrand);
  }, [selectedBrand]);

  return (
    <BrandContext.Provider value={{ selectedBrand, setSelectedBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

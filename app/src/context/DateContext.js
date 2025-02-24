import React, { createContext, useContext, useState, useEffect } from 'react';

const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [dateFilter, setDateFilter] = useState(() => {
    return sessionStorage.getItem('dateFilter') || 'W';
  });

  useEffect(() => {
    sessionStorage.setItem('dateFilter', dateFilter);
  }, [dateFilter]);

  // Helper function to get date range based on filter
  const getDateRange = () => {
    const endDate = new Date(2025, 0, 31);
    const startDate = new Date(2025, 0, 31); // Set start date to 2025-01-31 (Manual Code)

    switch (dateFilter) {
      case 'W':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '12M':
        startDate.setMonth(endDate.getMonth() - 12);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  return (
    <DateContext.Provider value={{ dateFilter, setDateFilter, getDateRange }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};

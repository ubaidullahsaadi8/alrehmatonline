'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Currency, convertCurrency, formatCurrency } from '@/lib/currency';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertAmount: (amount: number) => number;
  formatAmount: (amount: number) => string;
  isLoading: boolean;
  refreshCurrency: () => Promise<void>; 
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'USD',
  setCurrency: () => {},
  convertAmount: (amount) => amount,
  formatAmount: (amount) => `$${amount.toFixed(2)}`,
  isLoading: true,
  refreshCurrency: async () => {}, 
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);
  
  
  const fetchUserCurrency = async () => {
    try {
      
      const response = await fetch('/api/user/currency');
      if (response.ok) {
        const data = await response.json();
        console.log('Currency context - loaded preference from API:', data);
        if (data.currency) {
          setCurrency(data.currency as Currency);
        }
      } else {
        console.error('Currency context - API returned error:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user currency preference:', error);
    }
    
    
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency) {
      console.log('Currency context - found in localStorage:', savedCurrency);
      setCurrency(savedCurrency as Currency);
    }
    
    setIsLoading(false);
  };
  
  
  const refreshCurrency = async () => {
    console.log('Currency context - refreshing currency data');
    try {
      const response = await fetch('/api/user/currency', { 
        cache: 'no-store', 
        headers: { 'x-refresh': 'true' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Currency context - refreshed data:', data);
        if (data.currency) {
          setCurrency(data.currency as Currency);
          localStorage.setItem('preferredCurrency', data.currency as string);
        }
      }
    } catch (error) {
      console.error('Error refreshing currency data:', error);
    }
  };

  useEffect(() => {
    
    fetchUserCurrency();
  }, []);

  
  useEffect(() => {
    if (!isLoading) {
      
      localStorage.setItem('preferredCurrency', currency);
      
      
      console.log('Currency changed to', currency, '- saved to localStorage only');
    }
  }, [currency, isLoading]);

  const convertAmount = (amount: number) => {
    return convertCurrency(amount, currency);
  };

  const formatAmount = (amount: number) => {
    return formatCurrency(amount, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convertAmount,
        formatAmount,
        isLoading,
        refreshCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

'use client';

import { useCurrency } from '@/lib/currency-context';
import { getCurrencyIcon } from '@/lib/currency';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function CurrencyBadge() {
  const { currency, isLoading, refreshCurrency } = useCurrency();
  const [mounted, setMounted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  
  useEffect(() => {
    setMounted(true);
    
    
    const loadLatestCurrency = async () => {
      await refreshCurrency();
    };
    
    loadLatestCurrency();
  }, [refreshCurrency]);
  
  const getCurrencyName = useCallback(() => {
    switch(currency) {
      case 'USD': return 'US Dollar';
      case 'PKR': return 'Pakistani Rupee';
      case 'SAR': return 'Saudi Riyal';
      case 'AED': return 'UAE Dirham';
      case 'INR': return 'Indian Rupee';
      case 'EUR': return 'Euro';
      case 'GBP': return 'British Pound';
      default: return 'Currency';
    }
  }, [currency]);
  
  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRefreshing(true);
    await refreshCurrency();
    setRefreshing(false);
  };

  if (!mounted || isLoading) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex items-center gap-1 px-2.5 py-1.5 text-white hover:text-white/90 cursor-default transition-colors"
            onClick={handleRefresh}
          >
            <span className="text-sm font-medium">{getCurrencyIcon(currency)}</span>
            <span className="text-sm font-medium">{currency}</span>
            {refreshing && (
              <RefreshCw className="h-3 w-3 ml-0.5 animate-spin" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-gray-800 text-white" style={{ border: "none", outline: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)" }}>
          <p>Your currency: {getCurrencyName()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

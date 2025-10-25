'use client';

import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
   SelectValue 
} from '@/components/ui/select';
import { useCurrency } from '@/lib/currency-context';
import { currencyNames, Currency, currencySymbols, getCurrencyIcon } from '@/lib/currency';
import { useToast } from '@/components/ui/use-toast';

interface CurrencySelectorProps {
  showLabel?: boolean;
  size?: 'sm' | 'default';
}

export default function CurrencySelector({ 
  showLabel = true,
  size = 'default'
}: CurrencySelectorProps) {
  const { currency, setCurrency, isLoading } = useCurrency();
  const [updating, setUpdating] = useState(false);
  const [lastSelectedCurrency, setLastSelectedCurrency] = useState<Currency | null>(null);
  const { toast } = useToast();

  const handleCurrencyChange = async (value: string) => {
    try {
      
      if (value === lastSelectedCurrency) {
        console.log('Currency already set to', value, '- skipping update');
        return;
      }
      
      setUpdating(true);
      setLastSelectedCurrency(value as Currency);
      
      
      setCurrency(value as Currency);
      
      
      console.log('Saving currency preference to server:', value);
      
      
      try {
        await fetch('/api/migrations/add-currency-column');
      } catch (error) {
        console.error('Error ensuring currency column exists:', error);
        
      }
      
      
      const response = await fetch('/api/user/simple-currency', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currency: value }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data);
        toast({
          title: "Currency Updated",
          description: `Your preferred currency is now set to ${currencyNames[value as Currency]}`,
        });
      } else {
        console.error('Server error:', response.status, await response.text());
        toast({
          title: "Server Error",
          description: `Server returned status ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating currency:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update currency preference",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      {showLabel && <label className="text-sm font-medium">Preferred Currency</label>}
      <Select 
        value={currency} 
        onValueChange={handleCurrencyChange}
        disabled={isLoading || updating}
      >
        <SelectTrigger className={size === 'sm' ? 'h-8 w-32' : ''}>
          <SelectValue placeholder="Select currency">
            {currency && (
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getCurrencyIcon(currency as Currency)}</span>
                <span>{currencySymbols[currency as Currency]} {currency}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Currency</SelectLabel>
            {Object.entries(currencyNames).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                <div className="flex items-center space-x-2">
                  <span>{getCurrencyIcon(code as Currency)}</span>
                  <span className="font-medium">{currencySymbols[code as Currency]} {code}</span>
                  <span className="text-muted-foreground">- {name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

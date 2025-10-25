
export type Currency = 'USD' | 'PKR' | 'SAR' | 'AED' | 'INR' | 'EUR' | 'GBP';



export const exchangeRates: Record<Currency, number> = {
  USD: 1.00,      
  PKR: 278.50,    
  SAR: 3.75,      
  AED: 3.67,      
  INR: 83.30,     
  EUR: 0.93,      
  GBP: 0.81,      
};

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  PKR: '₨',
  SAR: '﷼',
  AED: 'د.إ',
  INR: '₹',
  EUR: '€',
  GBP: '£',
};

export const currencyNames: Record<Currency, string> = {
  USD: 'US Dollar',
  PKR: 'Pakistani Rupee',
  SAR: 'Saudi Riyal',
  AED: 'UAE Dirham',
  INR: 'Indian Rupee',
  EUR: 'Euro',
  GBP: 'British Pound',
};

export function convertCurrency(amount: number, targetCurrency: Currency): number {
  if (targetCurrency === 'USD') return amount;
  return amount * exchangeRates[targetCurrency];
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyWithSymbol(amount: number, currency: Currency): string {
  return `${currencySymbols[currency]}${amount.toFixed(2)}`;
}

export function getCurrencyIcon(currency: Currency): string {
  const currencyIcons: Record<Currency, string> = {
    USD: '🇺🇸',
    PKR: '🇵🇰',
    SAR: '🇸🇦',
    AED: '🇦🇪',
    INR: '🇮🇳',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
  };
  
  return currencyIcons[currency] || '💰';
}

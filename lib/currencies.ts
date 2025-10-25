
export const currencies = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$"
  },
  {
    code: "PKR",
    name: "Pakistani Rupee",
    symbol: "₨"
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    symbol: "﷼"
  },
  {
    code: "AED",
    name: "UAE Dirham",
    symbol: "د.إ"
  },
  {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹"
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€"
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£"
  }
];


export function getCurrencyByCode(code: string) {
  return currencies.find(currency => currency.code === code) || currencies[0];
}


export function formatCurrency(amount: number, currencyCode: string = "USD") {
  const currency = getCurrencyByCode(currencyCode);
  
  return {
    formatted: `${currency.symbol}${amount.toLocaleString()}`,
    symbol: currency.symbol,
    code: currency.code
  };
}

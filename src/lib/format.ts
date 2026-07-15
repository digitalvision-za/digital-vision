export function formatStartingPrice(amount: number | null, currency: string, qualifier: string) {
  if (amount === null) {
    return "Let us scope it together";
  }

  return `${qualifier} ${new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)}`;
}
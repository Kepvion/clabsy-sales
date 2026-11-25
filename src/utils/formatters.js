// Indian Currency and Real Estate Unit Formatters

export function formatINR(amount, options = {}) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  const { compact = false, showPaisa = false } = options;
  const num = Number(amount);

  if (compact) {
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2).replace(/\.00$/, '')} L`;
    }
    if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}k`;
    }
  }

  // Standard Indian comma separator: 12,34,567
  const parts = num.toFixed(showPaisa ? 2 : 0).split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formattedWhole = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  return `₹${formattedWhole}${parts[1] ? '.' + parts[1] : ''}`;
}

export function formatLakhs(lakhs) {
  if (!lakhs && lakhs !== 0) return '₹0';
  if (lakhs >= 100) {
    return `₹${(lakhs / 100).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  return `₹${Number(lakhs).toFixed(1).replace(/\.0$/, '')} Lakhs`;
}

export function formatArea(sqft) {
  if (!sqft) return '0 sq.ft';
  const sqyd = (sqft / 9).toFixed(1);
  return {
    sqft: `${Number(sqft).toLocaleString('en-IN')} sq.ft`,
    sqyd: `${sqyd} sq.yd`,
    combined: `${Number(sqft).toLocaleString('en-IN')} sq.ft (${sqyd} sq.yd)`
  };
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function timeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
}

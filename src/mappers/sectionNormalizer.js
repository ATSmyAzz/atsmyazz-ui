import ashTemplate from '../template/ashTemplate.json';

/**
 * Normalizes section names to match the Ash template format
 */
export const normalizeSectionName = (sectionName) => {
  const lowerName = sectionName.toLowerCase().trim();

  for (const [standardName, aliases] of Object.entries(ashTemplate.sectionAliases)) {
    if (aliases.some(alias => lowerName.includes(alias))) {
      return standardName;
    }
  }

  return null;
};

/**
 * Normalizes date formats to MM/YYYY – MM/YYYY or MM/YYYY – Present
 */
export const normalizeDate = (dateString) => {
  if (!dateString) return '';

  const cleaned = dateString.trim();

  // Already in correct format
  if (cleaned.match(/\d{2}\/\d{4}\s*–\s*(\d{2}\/\d{4}|Present)/)) {
    return cleaned;
  }

  // Try to extract dates
  const datePattern = /(\d{1,2})[-\/](\d{4})|(\d{4})|(\w+\s+\d{4})/g;
  const matches = [...cleaned.matchAll(datePattern)];

  if (matches.length >= 2) {
    const start = formatDateMatch(matches[0]);
    const end = cleaned.toLowerCase().includes('present') ? 'Present' : formatDateMatch(matches[1]);
    return `${start} – ${end}`;
  } else if (matches.length === 1) {
    return formatDateMatch(matches[0]);
  }

  return cleaned;
};

const formatDateMatch = (match) => {
  if (match[1] && match[2]) {
    // MM/YYYY format
    const month = match[1].padStart(2, '0');
    return `${month}/${match[2]}`;
  } else if (match[3]) {
    // YYYY only
    return `01/${match[3]}`;
  } else if (match[4]) {
    // Month YYYY
    const parts = match[4].split(' ');
    const monthMap = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
      'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
      'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    };
    const month = monthMap[parts[0].toLowerCase().substring(0, 3)] || '01';
    return `${month}/${parts[1]}`;
  }
  return match[0];
};

/**
 * Extracts and bolds metrics in text (numbers with %, +, K, M, B suffixes)
 */
export const highlightMetrics = (text) => {
  if (!text) return text;

  // Pattern for metrics: numbers with %, K+, M+, B+, or standalone percentages
  const metricPattern = /(\d+(?:\.\d+)?(?:\s*[%KMB]\+?|\+))/gi;

  return text.replace(metricPattern, '<strong>$1</strong>');
};

/**
 * Normalizes company names to UPPERCASE format
 */
export const normalizeCompanyName = (name) => {
  return name.toUpperCase().trim();
};

/**
 * Extracts GPA from education text
 */
export const extractGPA = (text) => {
  const gpaPattern = /GPA:?\s*(\d\.\d+(?:\/\d\.\d+)?)/i;
  const match = text.match(gpaPattern);
  return match ? `GPA: ${match[1]}` : '';
};

/**
 * Cleans bullet points (removes leading symbols)
 */
export const cleanBullet = (bullet) => {
  return bullet.replace(/^[•\-*◦▪]\s*/, '').trim();
};

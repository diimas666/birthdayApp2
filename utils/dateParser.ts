// Парсинг украинской даты в формате "1 січня 1994" или "1 січня 1994 р."
export const parseUkrainianDate = (dateString: string): Date | null => {
  const trimmed = dateString.trim();
  
  // Убираем "р." в конце если есть
  const cleaned = trimmed.replace(/\s*р\.?\s*$/, '');
  
  // Украинские названия месяцев
  const months: { [key: string]: number } = {
    'січня': 0, 'січень': 0,
    'лютого': 1, 'лютий': 1,
    'березня': 2, 'березень': 2,
    'квітня': 3, 'квітень': 3,
    'травня': 4, 'травень': 4,
    'червня': 5, 'червень': 5,
    'липня': 6, 'липень': 6,
    'серпня': 7, 'серпень': 7,
    'вересня': 8, 'вересень': 8,
    'жовтня': 9, 'жовтень': 9,
    'листопада': 10, 'листопад': 10,
    'грудня': 11, 'грудень': 11,
  };
  
  // Паттерн: число месяц год
  const pattern = /^(\d{1,2})\s+([а-яіїєґ]+)\s+(\d{4})$/i;
  const match = cleaned.match(pattern);
  
  if (!match) {
    return null;
  }
  
  const day = parseInt(match[1], 10);
  const monthName = match[2].toLowerCase();
  const year = parseInt(match[3], 10);
  
  const month = months[monthName];
  
  if (month === undefined) {
    return null;
  }
  
  // Проверка корректности дня
  if (day < 1 || day > 31) {
    return null;
  }
  
  // Проверка корректности года
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return null;
  }
  
  const date = new Date(year, month, day);
  
  // Проверка, что дата валидна (например, 31 февраля не существует)
  if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
    return null;
  }
  
  return date;
};

// Форматирование даты в украинский формат для отображения
export const formatDateForInput = (date: Date): string => {
  const day = date.getDate();
  const monthNames = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

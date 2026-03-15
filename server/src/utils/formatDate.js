const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

module.exports = {
  formatDate
};

export const formatSentAt = (sentAt: string): string => {
    const date = new Date(sentAt);
    const now = new Date();
  
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();
  
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
  
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();
  
    // Format time as HH:mm
    const timeFormatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    });
  
    if (isToday) return `Today, ${timeFormatter.format(date)}`;
    if (isYesterday) return `Yesterday, ${timeFormatter.format(date)}`;
  
    // Format full date (YYYY-MM-DD)
    const dateFormatter = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  
    return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`;
  };
  
export function formatDateAndTime(timestamp: string): string {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0'); //padstart makes the string grow by 0 untill its length get to 2
  
    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }
  
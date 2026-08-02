// Formats any date value into DD-MM-YYYY.
export function formatDate(input: string | Date | null | undefined): string {
  if (!input) return "";

  let date: Date;
  if (input instanceof Date) {
    date = input;
  } else {
    date = new Date(input);
  }

  if (isNaN(date.getTime())) {
    return String(input);
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
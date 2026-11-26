/** WhatsApp chat link for an Indonesian number written as 08..., +62 8..., or 62-8.... */
export function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const intl = digits.startsWith('62') ? digits : `62${digits.replace(/^0/, '')}`;
  return `https://wa.me/${intl}`;
}

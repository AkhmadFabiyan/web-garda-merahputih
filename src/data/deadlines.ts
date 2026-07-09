import { GARDA_CONFIG } from './gardaConfig';

export interface Deadline {
  name: string;
  status: {
    label: string;
  };
}

export function getTimelinePhase(): string {
  const now = new Date().getTime();
  const praStart = new Date(GARDA_CONFIG.DATES.PRA_PKKMB_START).getTime();
  const univStart = new Date(GARDA_CONFIG.DATES.PKKMB_UNIV_START).getTime();
  const fakStart = new Date(GARDA_CONFIG.DATES.PKKMB_FAK_START).getTime();
  const fakEnd = new Date(GARDA_CONFIG.DATES.PKKMB_FAK_END).getTime();

  if (now < praStart) return "Persiapan Pra-PKKMB";
  if (now >= praStart && now < univStart) return "Pra-PKKMB";
  if (now >= univStart && now < fakStart) return "PKKMB Universitas";
  if (now >= fakStart && now <= fakEnd) return "PKKMB Fakultas";
  return "Pasca-PKKMB";
}

export function getActiveDeadlines(): Deadline[] {
  // Mengembalikan data statis/dummy untuk saat ini.
  // Nantinya bisa disambungkan dengan database sungguhan.
  return [];
}

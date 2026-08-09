/**
 * Input Preprocessor
 * Normalizes typos, abbreviations, and common misspellings
 * before intent detection and knowledge search.
 */

// Singkatan & typo umum mahasiswa Indonesia
const NORMALIZATIONS: Array<[RegExp, string]> = [
  // PKKMB-specific
  [/\bpk2mb\b/gi, 'pkkmb'],
  [/\bpkkm\b/gi, 'pkkmb'],
  [/\bpkkmbb\b/gi, 'pkkmb'],
  [/\bpresns\b/gi, 'presensi'],
  [/\bprsns\b/gi, 'presensi'],
  [/\bpresansi\b/gi, 'presensi'],
  [/\babsn\b/gi, 'absen'],
  [/\babsnsi\b/gi, 'absensi'],
  [/\babsenasi\b/gi, 'absensi'],
  [/\btgs\b/gi, 'tugas'],
  [/\bpngsn\b/gi, 'penugasan'],
  [/\bpngsan\b/gi, 'penugasan'],
  [/\bpengsn\b/gi, 'penugasan'],
  [/\bjdwl\b/gi, 'jadwal'],
  [/\bjadwl\b/gi, 'jadwal'],
  [/\bpngmman\b/gi, 'pengumuman'],
  [/\bpgmmn\b/gi, 'pengumuman'],
  [/\bpngmman\b/gi, 'pengumuman'],
  [/\bdrscd\b/gi, 'dresscode'],
  [/\bdrscode\b/gi, 'dresscode'],
  [/\bdress\s*cod\b/gi, 'dresscode'],
  [/\bizn\b/gi, 'izin'],
  [/\bprzinan\b/gi, 'perizinan'],
  [/\bpnitia\b/gi, 'panitia'],
  [/\bpntia\b/gi, 'panitia'],

  // Contact person aliases
  [/\bkonper\b/gi, 'contact person'],
  [/\bkp\s+(ft|fip|fbs|fmipa|feb|fisipol|fikk|fv|fh|fpsi|fkp|fk)\b/gi, 'cp $1'],

  // Common informal Indonesian
  [/\bgmn\b/gi, 'gimana'],
  [/\bdmn\b/gi, 'dimana'],
  [/\bkpn\b/gi, 'kapan'],
  [/\bhrs\b/gi, 'harus'],
  [/\bblh\b/gi, 'boleh'],
  [/\btlg\b/gi, 'tolong'],
  [/\bmksh\b/gi, 'makasih'],
  [/\btks\b/gi, 'terima kasih'],
  [/\bokk\b/gi, 'oke'],
  [/\boky\b/gi, 'oke'],
  [/\bok\b/gi, 'oke'],
  [/\bnanya\b/gi, 'tanya'],
  [/\bbtw\b/gi, 'omong-omong'],
  [/\bfyi\b/gi, 'sekedar info'],

  // Remove repeated characters (stresss → stress, bantuuu → bantu)
  [/(.)\1{2,}/g, '$1$1'],
];

export function preprocessInput(input: string): string {
  let result = input.trim();
  for (const [pattern, replacement] of NORMALIZATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

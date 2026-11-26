// Singkatan & typo umum mahasiswa Indonesia
const NORMALIZATIONS: Array<[RegExp, string]> = [
  // Huruf berulang dulu (presensiii → presensii, bantuuu → bantuu), hanya huruf supaya angka seperti 1000 aman
  [/([a-z])\1{2,}/gi, '$1$1'],

  // PKKMB-specific
  [/\b(pk2mb|pkkm|pkkmbb|pkmb|pekaem)\b/gi, 'pkkmb'],
  [/\bpra\s*-?\s*pkkmb\b/gi, 'pra-pkkmb'],
  [/\bd\s*-?\s*day\b/gi, 'd-day'],
  [/\b(presns|prsns|presansi|presnsi|prsensi|presen)\b/gi, 'presensi'],
  [/\b(absn|absenn)\b/gi, 'absen'],
  [/\b(absnsi|absenasi)\b/gi, 'absensi'],
  [/\btgs\b/gi, 'tugas'],
  [/\b(pngsn|pngsan|pengsn)\b/gi, 'penugasan'],
  [/\b(essai|esay|esei)\b/gi, 'esai'],
  [/\b(rsm|resum|resumee)\b/gi, 'resume'],
  [/\b(dedlen|dedline|dedlain)\b/gi, 'deadline'],
  [/\b(plagiat|plagiasi)\b/gi, 'plagiarisme'],
  [/\b(jdwl|jadwl|jdwal)\b/gi, 'jadwal'],
  [/\b(pngmman|pgmmn|pengumumn)\b/gi, 'pengumuman'],
  [/\b(drscd|drscode|dreskod|dreskode|dresskode|dresscod|dress\s*cod)\b/gi, 'dresscode'],
  [/\b(izn|ijin)\b/gi, 'izin'],
  [/\bprzinan\b/gi, 'perizinan'],
  [/\b(pnitia|pntia)\b/gi, 'panitia'],
  [/\b(fak|fklts|fakul)\b/gi, 'fakultas'],

  // Contact person aliases
  [/\bkonper\b/gi, 'contact person'],
  [/\b(kp|c\.p\.?|cepe|cpnya|cp-nya)(?=\s|$|[?!.,])/gi, 'cp'],
  [/\b(kontek|kntk|kontk)\b/gi, 'kontak'],
  [/\bnmr\b/gi, 'nomor'],

  // Common informal Indonesian
  [/\bgmn\b/gi, 'gimana'],
  [/\b(dmn|dmna)\b/gi, 'dimana'],
  [/\bkpn\b/gi, 'kapan'],
  [/\bbrp\b/gi, 'berapa'],
  [/\bhrs\b/gi, 'harus'],
  [/\bblh\b/gi, 'boleh'],
  [/\btlg\b/gi, 'tolong'],
  [/\byg\b/gi, 'yang'],
  [/\butk\b/gi, 'untuk'],
  [/\bdgn\b/gi, 'dengan'],
  [/\btgl\b/gi, 'tanggal'],
  [/\bbsk\b/gi, 'besok'],
  [/\b(skrg|skrng)\b/gi, 'sekarang'],
  [/\bhr\s+ini\b/gi, 'hari ini'],
  [/\b(gk|gak|ngga|nggak|enggak|kagak)\b/gi, 'ga'],
  [/\bmksh\b/gi, 'makasih'],
  [/\btks\b/gi, 'terima kasih'],
  [/\b(okk|oky|ok)\b/gi, 'oke'],
  [/\bnanya\b/gi, 'tanya'],
  [/\bbtw\b/gi, 'omong-omong'],
  [/\bfyi\b/gi, 'sekedar info'],
];

export function preprocessInput(input: string): string {
  let result = input.trim();
  for (const [pattern, replacement] of NORMALIZATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

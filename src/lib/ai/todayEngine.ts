import { timelineData } from '../../data/schedule';
import { announcements } from '../../data/announcements';
import { activeAndUpcoming } from '../schedule';

export interface TodayResult {
  date: string;
  activeEvent: typeof timelineData[0] | null;
  upcomingEvent: typeof timelineData[0] | null;
  activeAnnouncements: typeof announcements;
  message: string;
}

export function getTodayInfo(): TodayResult {
  const now = new Date();
  const todayStr = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });

  const activeAnnouncements = announcements.filter((a) => a.isActive);

  // Same stage logic as the website (Peta Perjalanan, /jadwal)
  const { active: activeEvent, upcoming: upcomingEvent } = activeAndUpcoming(timelineData, now.getTime());

  const message = buildTodayMessage(todayStr, activeEvent, upcomingEvent, activeAnnouncements);

  return {
    date: todayStr,
    activeEvent,
    upcomingEvent,
    activeAnnouncements,
    message,
  };
}

function buildTodayMessage(
  dateStr: string,
  activeEvent: typeof timelineData[0] | null,
  upcomingEvent: typeof timelineData[0] | null,
  activeAnnouncements: typeof announcements
): string {
  const lines: string[] = [];
  lines.push(`📅 **${dateStr}**\n`);

  if (activeEvent) {
    lines.push(`🔴 **Kegiatan Berlangsung: ${activeEvent.title}**`);
    lines.push(`📆 ${activeEvent.date}\n`);
    lines.push('**Yang Harus Dilakukan Hari Ini:**');
    activeEvent.details?.activities?.forEach((act) => lines.push(`• ${act}`));
  } else if (upcomingEvent) {
    lines.push(`⏳ Belum ada kegiatan aktif hari ini.`);
    lines.push(`\n📌 **Kegiatan Berikutnya: ${upcomingEvent.title}**`);
    lines.push(`📆 ${upcomingEvent.date}\n`);
    lines.push('**Persiapkan:**');
    upcomingEvent.details?.activities?.forEach((act) => lines.push(`• ${act}`));
  } else {
    lines.push(
      '📌 Semua rangkaian kegiatan PKKMB telah selesai. Terima kasih sudah mengikuti Garda UNESA 2026! 🎉'
    );
  }

  if (activeAnnouncements.length > 0) {
    lines.push('\n📢 **Pengumuman Aktif:**');
    activeAnnouncements.slice(0, 2).forEach((ann) => {
      lines.push(`• **${ann.title}**: ${ann.content.length > 100 ? `${ann.content.slice(0, 100)}...` : ann.content}`);
    });
  }

  return lines.join('\n');
}

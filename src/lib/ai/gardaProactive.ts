import { getActiveDeadlines, getTimelinePhase } from '../../data/deadlines';

const GREETINGS = [
  "Hai 👋 Aku **Gara**, asisten resmi Garda UNESA 2026.",
  "Halo! 👋 Aku **Gara**.",
  "Halo kawan! 👋 Aku **Gara**, asisten resmi Garda UNESA.",
  "Hai 👋 Aku **Gara**!"
];

export function generateProactiveGreeting(): string {
  const baseGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  const phase = getTimelinePhase();
  const activeDeadlines = getActiveDeadlines();

  let message = `${baseGreeting}\n\nKita sekarang ada di fase **${phase}**. `;

  if (activeDeadlines.length > 0) {
    message += `Hari ini ada ${activeDeadlines.length} hal penting yang perlu kamu perhatikan:\n\n`;
    activeDeadlines.forEach((d) => {
      // Determine urgency icon based on label
      let icon = '⏳';
      if (d.status.label.includes('Dibuka')) icon = '🔜';
      if (d.status.label.includes('Jam') || d.status.label.includes('Menit')) icon = '⚠';
      
      message += `${icon} **${d.name}** (${d.status.label})\n`;
    });
  } else {
    message += "Sepertinya belum ada deadline mendesak hari ini. Tetap semangat!\n";
  }

  message += "\nAda yang bisa kubantu?";
  
  return message;
}

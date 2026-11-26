import React from 'react';
import type { IconType } from 'react-icons';
import {
  FaBolt, FaBook, FaBroom, FaBullhorn, FaCalendarAlt, FaCheckCircle, FaCircle, FaClock,
  FaExclamationTriangle, FaGlassCheers, FaGraduationCap, FaHourglassHalf, FaMapMarkerAlt,
  FaMobileAlt, FaPen, FaPrayingHands, FaRegCommentDots, FaRegGrinBeamSweat, FaRegSmile,
  FaRobot, FaSearch, FaThumbsUp, FaThumbtack, FaTrophy,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { MdWavingHand } from 'react-icons/md';

// Emoji in bot text (hardcoded strings and AI replies) are shown as icons instead.
const EMOJI_ICONS: Record<string, IconType> = {
  '🎓': FaGraduationCap, '😊': FaRegSmile, '😄': FaRegSmile, '😃': FaRegSmile, '🙂': FaRegSmile,
  '😅': FaRegGrinBeamSweat, '📱': FaMobileAlt, '🧹': FaBroom, '✨': HiSparkles, '👋': MdWavingHand,
  '🔎': FaSearch, '🔍': FaSearch, '📚': FaBook, '✍': FaPen, '⏳': FaHourglassHalf, '🔜': FaClock,
  '⚠': FaExclamationTriangle, '📅': FaCalendarAlt, '📆': FaCalendarAlt, '🔴': FaCircle,
  '📌': FaThumbtack, '🎉': FaGlassCheers, '📢': FaBullhorn, '🙏': FaPrayingHands, '👍': FaThumbsUp,
  '✅': FaCheckCircle, '📍': FaMapMarkerAlt, '💬': FaRegCommentDots, '🤖': FaRobot, '⚡': FaBolt,
  '🏆': FaTrophy,
};

const EMOJI_SPLIT = /(\p{Extended_Pictographic}️?)/u;
const ICON_STYLE: React.CSSProperties = { verticalAlign: '-0.125em' };

/** Replaces known emoji in a string with react-icons; unknown emoji stay as text. */
export function iconize(text: string, keyPrefix = 'ic'): React.ReactNode[] {
  return text.split(EMOJI_SPLIT).map((part, i) => {
    const Icon = EMOJI_ICONS[part.replace('️', '')];
    return Icon ? <Icon key={`${keyPrefix}-${i}`} aria-hidden="true" style={ICON_STYLE} /> : part;
  });
}

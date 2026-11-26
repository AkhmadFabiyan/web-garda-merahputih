'use client';

import React, { useState, useEffect } from 'react';
import styles from './GardaMessage.module.css';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { FaRobot, FaWhatsapp } from 'react-icons/fa';
import { iconize } from '../../ui/Iconize';

export interface WaContact {
  name: string;
  phone: string;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  contacts?: WaContact[];
  isWelcome?: boolean;
  suggestions?: string[];
}

interface GardaMessageProps {
  message: Message;
  onSuggestionSelect?: (suggestion: string) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Advanced markdown renderer: lists, headers, bold, italic, links */
function renderText(text: string): React.ReactNode {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      result.push(<ul key={`ul-${result.length}`} className={styles.gardaList}>{listItems}</ul>);
      inList = false;
      listItems = [];
    }
  };

  const processInline = (line: string, lineKey: string) => {
    const linkParts = line.split(/(\[[^\]]+\]\([^)]+\))/g);
    return linkParts.map((linkPart, j) => {
      const linkMatch = linkPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        return (
          <a key={`${lineKey}-link-${j}`} href={linkMatch[2]} className={styles.gardaLink} target="_blank" rel="noopener noreferrer">
            {linkMatch[1]}
          </a>
        );
      }
      const parts = linkPart.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return parts.map((part, k) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${lineKey}-bold-${k}`}>{iconize(part.slice(2, -2), `${lineKey}-b-${k}`)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
          return <em key={`${lineKey}-italic-${k}`}>{iconize(part.slice(1, -1), `${lineKey}-i-${k}`)}</em>;
        }
        return iconize(part, `${lineKey}-${j}-${k}`);
      });
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if it's a list item
    const listMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      inList = true;
      listItems.push(<li key={`li-${i}`}>{processInline(listMatch[1], `li-${i}`)}</li>);
      continue;
    }
    
    flushList();
    
    if (trimmed === '') {
      result.push(<br key={`br-${i}`} />);
      continue;
    }

    // Check if it's a header (### Header)
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      result.push(<strong key={`h-${i}`} className={styles.gardaHeader}>{processInline(headerMatch[2], `h-${i}`)}</strong>);
      result.push(<br key={`br-h-${i}`} />);
      continue;
    }

    // Normal text
    result.push(<span key={`text-${i}`}>{processInline(line, `text-${i}`)}</span>);
    if (i < lines.length - 1 && lines[i+1].trim() !== '' && !lines[i+1].trim().match(/^[-*]\s+/)) {
        result.push(<br key={`br-n-${i}`} />);
    }
  }

  flushList();
  return <>{result}</>;
}

export const GardaMessage: React.FC<GardaMessageProps> = ({ message, onSuggestionSelect }) => {
  const isBot = message.role === 'bot';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [displayedText, setDisplayedText] = useState(() => {
    if (!isBot || message.isWelcome) return message.text;
    // Only apply typing effect for freshly created messages (< 2s)
    const isFresh = Date.now() - message.timestamp.getTime() < 2000;
    return isFresh ? '' : message.text;
  });

  useEffect(() => {
    if (!isBot || message.isWelcome) {
      if (displayedText !== message.text) {
        const t = setTimeout(() => setDisplayedText(message.text), 0);
        return () => clearTimeout(t);
      }
      return;
    }

    if (displayedText.length < message.text.length) {
      const timeout = setTimeout(() => {
        // Type characters sequentially
        setDisplayedText(message.text.slice(0, displayedText.length + 1));
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [displayedText, message.text, isBot, message.isWelcome]);

  return (
    <div className={`${styles.message} ${isBot ? styles.bot : styles.user}`}>
      {isBot && (
        <div className={styles.botAvatar} aria-hidden="true"><FaRobot /></div>
      )}
      <div>
        <div
          className={`${styles.bubble} ${message.isWelcome ? styles.welcome : ''}`}
          role={isBot ? 'status' : undefined}
        >
          {renderText(displayedText)}

          {/* WhatsApp buttons for contact intent */}
          {message.contacts && message.contacts.length > 0 && (
            <div className={styles.contactsWrap}>
              {message.contacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`https://wa.me/62${contact.phone.replace(/^0/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.waBtn}
                  aria-label={`Hubungi ${contact.name} via WhatsApp`}
                >
                  <span className={styles.waIcon} aria-hidden="true"><FaWhatsapp /></span>
                  <div className={styles.waMeta}>
                    <span className={styles.waName}>{contact.name}</span>
                    <span className={styles.waPhone}>+62{contact.phone.replace(/^0/, '')}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
          {/* Suggestions / Quick Replies */}
          {message.suggestions && message.suggestions.length > 0 && onSuggestionSelect && (
            <div className={styles.suggestionsWrap}>
              {message.suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  className={styles.suggestionChip}
                  onClick={() => onSuggestionSelect(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.metaRow}>
          <div className={styles.timestamp}>{formatTime(message.timestamp)}</div>
          {isBot && (
            <button 
              className={styles.copyBtn} 
              onClick={handleCopy}
              aria-label="Salin pesan"
              title="Salin pesan"
            >
              {copied ? <FiCheck size={12} color="#10B981" /> : <FiCopy size={12} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

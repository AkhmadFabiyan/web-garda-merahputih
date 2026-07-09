import { IconType } from 'react-icons';

export interface QuickAccessItem {
  id: string;
  title: string;
  icon: IconType;
  href: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}


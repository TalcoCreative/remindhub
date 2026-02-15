export type Channel =
  | 'whatsapp'
  | 'web_chat'
  | 'call'
  | 'facebook'
  | 'instagram'
  | 'ecommerce'
  | 'email'
  | 'telegram'
  | 'twitter'
  | 'line';

export const channelLabels: Record<Channel, string> = {
  whatsapp: 'WhatsApp',
  web_chat: 'Web Chat',
  call: 'Call',
  facebook: 'Facebook Messenger',
  instagram: 'Instagram',
  ecommerce: 'E-commerce',
  email: 'Email',
  telegram: 'Telegram',
  twitter: 'X (Twitter)',
  line: 'Line Messenger',
};

export const channelColors: Record<Channel, string> = {
  whatsapp: 'bg-green-600 text-white',
  web_chat: 'bg-blue-500 text-white',
  call: 'bg-orange-500 text-white',
  facebook: 'bg-blue-700 text-white',
  instagram: 'bg-pink-500 text-white',
  ecommerce: 'bg-amber-600 text-white',
  email: 'bg-slate-600 text-white',
  telegram: 'bg-sky-500 text-white',
  twitter: 'bg-neutral-800 text-white',
  line: 'bg-emerald-500 text-white',
};

export const channelList: Channel[] = [
  'whatsapp', 'web_chat', 'call', 'facebook', 'instagram',
  'ecommerce', 'email', 'telegram', 'twitter', 'line',
];

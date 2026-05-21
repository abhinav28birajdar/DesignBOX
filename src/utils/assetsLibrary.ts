// Comprehensive SVG shapes library for DesignBox

export interface ShapeAsset {
  id: string;
  name: string;
  svg: string;
  preview: string;
  category: string;
  width?: number;
  height?: number;
}

export const BUILTIN_SHAPES: ShapeAsset[] = [
  // ===== BASIC SHAPES =====
  { id: 'rect', name: 'Rectangle', svg: '<rect x="10" y="10" width="80" height="80"/>', preview: '▭', category: 'Basic', width: 100, height: 100 },
  { id: 'circle', name: 'Circle', svg: '<circle cx="50" cy="50" r="40"/>', preview: '●', category: 'Basic', width: 100, height: 100 },
  { id: 'triangle', name: 'Triangle', svg: '<polygon points="50,10 90,90 10,90"/>', preview: '▲', category: 'Basic', width: 100, height: 100 },
  { id: 'pentagon', name: 'Pentagon', svg: '<polygon points="50,10 90,35 73,85 27,85 10,35"/>', preview: '⬠', category: 'Basic', width: 100, height: 100 },
  { id: 'hexagon', name: 'Hexagon', svg: '<polygon points="50,5 93,28 93,72 50,95 7,72 7,28"/>', preview: '⬡', category: 'Basic', width: 100, height: 100 },
  { id: 'star', name: 'Star', svg: '<polygon points="50,10 61,35 87,35 70,57 79,82 50,60 21,82 30,57 13,35 39,35"/>', preview: '★', category: 'Basic', width: 100, height: 100 },
  { id: 'arrow-right', name: 'Arrow Right', svg: '<path d="M20,50 L70,50 M50,30 L70,50 L50,70"/>', preview: '→', category: 'Basic', width: 100, height: 100 },
  { id: 'arrow-left', name: 'Arrow Left', svg: '<path d="M80,50 L30,50 M50,30 L30,50 L50,70"/>', preview: '←', category: 'Basic', width: 100, height: 100 },
  { id: 'arrow-up', name: 'Arrow Up', svg: '<path d="M50,80 L50,30 M30,50 L50,30 L70,50"/>', preview: '↑', category: 'Basic', width: 100, height: 100 },
  { id: 'arrow-down', name: 'Arrow Down', svg: '<path d="M50,20 L50,70 M30,50 L50,70 L70,50"/>', preview: '↓', category: 'Basic', width: 100, height: 100 },
  
  // ===== UI ELEMENTS =====
  { id: 'button', name: 'Button', svg: '<rect x="15" y="30" width="70" height="40" rx="5"/>', preview: '[ ]', category: 'UI', width: 100, height: 100 },
  { id: 'badge', name: 'Badge', svg: '<circle cx="50" cy="50" r="35"/>', preview: '◎', category: 'UI', width: 100, height: 100 },
  { id: 'input-box', name: 'Input Box', svg: '<rect x="10" y="40" width="80" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1"/>', preview: '▬', category: 'UI', width: 100, height: 100 },
  { id: 'checkbox', name: 'Checkbox', svg: '<rect x="25" y="25" width="50" height="50" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M35,50 L45,60 L65,40" fill="none" stroke="currentColor" stroke-width="2"/>', preview: '✓', category: 'UI', width: 100, height: 100 },
  { id: 'radio', name: 'Radio Button', svg: '<circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="15" fill="currentColor"/>', preview: '◉', category: 'UI', width: 100, height: 100 },
  { id: 'toggle', name: 'Toggle', svg: '<rect x="10" y="35" width="80" height="30" rx="15" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="30" cy="50" r="12" fill="currentColor"/>', preview: '◯◯', category: 'UI', width: 100, height: 100 },
  { id: 'card', name: 'Card', svg: '<rect x="15" y="20" width="70" height="60" rx="4" fill="none" stroke="currentColor" stroke-width="1"/>', preview: '□', category: 'UI', width: 100, height: 100 },
  { id: 'tab', name: 'Tab', svg: '<path d="M20,60 L30,30 L70,30 L80,60 L20,60" fill="none" stroke="currentColor" stroke-width="1"/><line x1="20" y1="60" x2="80" y2="60" stroke="currentColor" stroke-width="1"/>', preview: '⊏', category: 'UI', width: 100, height: 100 },

  // ===== DECORATIVE =====
  { id: 'heart', name: 'Heart', svg: '<path d="M50,75 C25,60 15,45 15,35 C15,25 25,18 32,18 C39,18 50,25 50,35 C50,25 61,18 68,18 C75,18 85,25 85,35 C85,45 75,60 50,75 Z"/>', preview: '♥', category: 'Decorative', width: 100, height: 100 },
  { id: 'wave', name: 'Wave', svg: '<path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="currentColor" stroke-width="2"/>', preview: '∿', category: 'Decorative', width: 100, height: 100 },
  { id: 'spiral', name: 'Spiral', svg: '<path d="M50,20 A30,30 0 0,1 70,50 A20,20 0 0,1 50,70 A10,10 0 0,1 50,50" fill="none" stroke="currentColor" stroke-width="2"/>', preview: '◉', category: 'Decorative', width: 100, height: 100 },
  { id: 'flower', name: 'Flower', svg: '<circle cx="50" cy="50" r="5"/><circle cx="50" cy="25" r="8"/><circle cx="75" cy="35" r="8"/><circle cx="75" cy="65" r="8"/><circle cx="50" cy="75" r="8"/><circle cx="25" cy="65" r="8"/><circle cx="25" cy="35" r="8"/>', preview: '❀', category: 'Decorative', width: 100, height: 100 },
  { id: 'leaf', name: 'Leaf', svg: '<path d="M50,20 Q70,50 50,80 Q30,50 50,20 Z"/>', preview: '🍃', category: 'Decorative', width: 100, height: 100 },
  { id: 'sun', name: 'Sun', svg: '<circle cx="50" cy="50" r="20"/><line x1="50" y1="15" x2="50" y2="5"/><line x1="50" y1="85" x2="50" y2="95"/><line x1="15" y1="50" x2="5" y2="50"/><line x1="85" y1="50" x2="95" y2="50"/><line x1="30" y1="30" x2="22" y2="22"/><line x1="70" y1="70" x2="78" y2="78"/><line x1="70" y1="30" x2="78" y2="22"/><line x1="30" y1="70" x2="22" y2="78"/>', preview: '◉', category: 'Decorative', width: 100, height: 100 },
  { id: 'moon', name: 'Moon', svg: '<path d="M50,20 A30,30 0 0,1 50,80 A25,25 0 0,0 50,20 Z"/>', preview: '☾', category: 'Decorative', width: 100, height: 100 },

  // ===== ABSTRACT =====
  { id: 'blob-1', name: 'Blob 1', svg: '<path d="M50,20 Q80,30 85,55 Q80,75 50,80 Q20,75 15,55 Q20,30 50,20 Z"/>', preview: '◉', category: 'Abstract', width: 100, height: 100 },
  { id: 'blob-2', name: 'Blob 2', svg: '<path d="M50,15 Q85,25 90,50 Q85,85 50,90 Q15,85 10,50 Q15,25 50,15 Z"/>', preview: '●', category: 'Abstract', width: 100, height: 100 },
  { id: 'splash', name: 'Splash', svg: '<path d="M50,30 Q70,25 80,40 Q75,55 60,60 Q50,65 45,50 Q40,35 50,30" fill="currentColor"/><circle cx="65" cy="50" r="3"/><circle cx="55" cy="65" r="2"/><circle cx="42" cy="45" r="2"/>', preview: '💧', category: 'Abstract', width: 100, height: 100 },
  { id: 'zigzag', name: 'Zigzag', svg: '<polyline points="10,30 25,50 40,30 55,50 70,30 85,50" fill="none" stroke="currentColor" stroke-width="2"/>', preview: '∿', category: 'Abstract', width: 100, height: 100 },
  { id: 'diamond', name: 'Diamond', svg: '<polygon points="50,15 85,50 50,85 15,50"/>', preview: '◇', category: 'Abstract', width: 100, height: 100 },

  // ===== ICONS (simplified) =====
  { id: 'settings', name: 'Settings', svg: '<circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="3" fill="currentColor"/><path d="M50,18 L50,10 M50,82 L50,90 M18,50 L10,50 M82,50 L90,50 M72,28 L78,22 M28,72 L22,78 M28,28 L22,22 M72,72 L78,78" stroke="currentColor" stroke-width="2"/>', preview: '⚙', category: 'Icons', width: 100, height: 100 },
  { id: 'lock', name: 'Lock', svg: '<rect x="25" y="45" width="50" height="35" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M35,45 Q35,30 50,30 Q65,30 65,45" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="65" r="3" fill="currentColor"/>', preview: '🔒', category: 'Icons', width: 100, height: 100 },
  { id: 'unlock', name: 'Unlock', svg: '<rect x="25" y="45" width="50" height="35" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M35,45 Q35,30 50,30 Q65,30 65,45 L65,55" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="65" r="3" fill="currentColor"/>', preview: '🔓', category: 'Icons', width: 100, height: 100 },
  { id: 'magnifier', name: 'Search', svg: '<circle cx="35" cy="35" r="15" fill="none" stroke="currentColor" stroke-width="2"/><line x1="48" y1="48" x2="65" y2="65" stroke="currentColor" stroke-width="2"/>', preview: '🔍', category: 'Icons', width: 100, height: 100 },
  { id: 'star-filled', name: 'Star Filled', svg: '<polygon points="50,15 61,40 87,40 70,57 79,82 50,65 21,82 30,57 13,40 39,40"/>', preview: '★', category: 'Icons', width: 100, height: 100 },
  { id: 'bookmark', name: 'Bookmark', svg: '<rect x="25" y="20" width="50" height="60" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="30,20 50,35 70,20" fill="none" stroke="currentColor" stroke-width="2"/>', preview: '🔖', category: 'Icons', width: 100, height: 100 },
  { id: 'share', name: 'Share', svg: '<circle cx="70" cy="25" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="30" cy="55" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="70" cy="75" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="65" y1="32" x2="35" y2="48" stroke="currentColor" stroke-width="2"/><line x1="65" y1="68" x2="35" y2="52" stroke="currentColor" stroke-width="2"/>', preview: '◌', category: 'Icons', width: 100, height: 100 },
  { id: 'download', name: 'Download', svg: '<line x1="50" y1="20" x2="50" y2="60" stroke="currentColor" stroke-width="2"/><polyline points="30,45 50,65 70,45" fill="none" stroke="currentColor" stroke-width="2"/><line x1="20" y1="75" x2="80" y2="75" stroke="currentColor" stroke-width="2"/>', preview: '◇', category: 'Icons', width: 100, height: 100 },
];

export const PALETTES = [
  { id: 'material', name: 'Material Design', colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5'] },
  { id: 'tailwind', name: 'Tailwind', colors: ['#1F2937', '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'] },
  { id: 'pastel', name: 'Pastel', colors: ['#FFB3BA', '#FFCDC3', '#FFFFBA', '#BAE1FF', '#FFD4E5'] },
  { id: 'neon', name: 'Neon', colors: ['#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF'] },
  { id: 'ocean', name: 'Ocean', colors: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#00D9FF'] },
  { id: 'sunset', name: 'Sunset', colors: ['#FF6B6B', '#FFA94D', '#FFD93D', '#6BCB77', '#4D96FF'] },
  { id: 'forest', name: 'Forest', colors: ['#1B4932', '#2D6A4F', '#40916C', '#52B788', '#95D5B2'] },
  { id: 'earth', name: 'Earth Tones', colors: ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460'] },
  { id: 'grayscale', name: 'Grayscale', colors: ['#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF'] },
  { id: 'vibrant', name: 'Vibrant', colors: ['#DC2F02', '#F77F00', '#FCBF49', '#EAE2B7', '#003049'] },
];

export const BUILTIN_FONTS = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Playfair Display',
  'Raleway', 'Poppins', 'Inter', 'Oswald', 'Merriweather',
  'Ubuntu', 'Nunito', 'Quicksand', 'Comfortaa', 'Pacifico'
];

export const TEMPLATE_PRESETS = [
  { id: 'instagram-post', name: 'Instagram Post', size: '1080x1080', category: 'Social Media' },
  { id: 'instagram-story', name: 'Instagram Story', size: '1080x1920', category: 'Social Media' },
  { id: 'twitter-post', name: 'Twitter Post', size: '1600x900', category: 'Social Media' },
  { id: 'facebook-post', name: 'Facebook Post', size: '1200x630', category: 'Social Media' },
  { id: 'linkedin-post', name: 'LinkedIn Post', size: '1200x627', category: 'Social Media' },
  { id: 'tiktok', name: 'TikTok Video', size: '1080x1920', category: 'Social Media' },
  { id: 'email-header', name: 'Email Header', size: '600x200', category: 'Business' },
  { id: 'business-card', name: 'Business Card', size: '1050x600', category: 'Business' },
  { id: 'presentation', name: 'Presentation', size: '1920x1080', category: 'Business' },
  { id: 'poster', name: 'Poster (18x24")', size: '5400x7200', category: 'Print' },
  { id: 'flyer', name: 'Flyer (8.5x11")', size: '2550x3300', category: 'Print' },
];

export const STICKERS_PACK = [
  { id: 'emoji-smile', name: 'Smile Emoji', url: '😊', category: 'Emojis' },
  { id: 'emoji-heart', name: 'Heart Emoji', url: '❤️', category: 'Emojis' },
  { id: 'emoji-star', name: 'Star Emoji', url: '⭐', category: 'Emojis' },
  { id: 'emoji-fire', name: 'Fire Emoji', url: '🔥', category: 'Emojis' },
  { id: 'emoji-rocket', name: 'Rocket Emoji', url: '🚀', category: 'Emojis' },
  { id: 'doodle-arrow', name: 'Arrow Doodle', url: '→', category: 'Doodles' },
  { id: 'doodle-check', name: 'Check Doodle', url: '✓', category: 'Doodles' },
  { id: 'badge-new', name: 'New Badge', url: 'NEW', category: 'Badges' },
  { id: 'badge-sale', name: 'Sale Badge', url: '50%', category: 'Badges' },
];

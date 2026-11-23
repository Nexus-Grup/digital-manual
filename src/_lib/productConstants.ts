// Listas usadas no formulário (cliente) e na validação (servidor).
// Os valores precisam ser iguais aos enums do schema.prisma.

export const CATEGORIES = [
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'APPLIANCES', label: 'Appliances' },
  { value: 'TOOLS', label: 'Tools' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const SUBCATEGORIES: Record<string, { value: string; label: string }[]> = {
  APPLIANCES: [
    { value: 'REFRIGERATOR', label: 'Refrigerator' },
    { value: 'WASHER', label: 'Washer' },
    { value: 'MICROWAVE', label: 'Microwave' },
  ],
  FURNITURE: [
    { value: 'WARDROBE', label: 'Wardrobe' },
    { value: 'TV_STAND', label: 'TV stand' },
    { value: 'DESK', label: 'Desk' },
  ],
  TOOLS: [
    { value: 'SCREWDRIVER', label: 'Screwdriver' },
    { value: 'DRILL', label: 'Drill' },
    { value: 'SANDER', label: 'Sander' },
  ],
  ELECTRONICS: [
    { value: 'TV', label: 'TV' },
    { value: 'SPEAKER', label: 'Speaker' },
    { value: 'HEADPHONES', label: 'Headphones' },
  ],
};

export const ALL_SUBCATEGORIES = Object.values(SUBCATEGORIES).flat();

export const DOCUMENT_TYPES = [
  { value: 'USER_MANUAL', label: 'User manual' },
  { value: 'ASSEMBLY_MANUAL', label: 'Assembly manual' },
  { value: 'TECHNICAL_DATASHEET', label: 'Technical datasheet' },
  { value: 'INSTALLATION_GUIDE', label: 'Installation guide' },
  { value: 'MAINTENANCE_GUIDE', label: 'Maintenance guide' },
  { value: 'WARRANTY_DOCUMENT', label: 'Warranty document' },
  { value: 'SAFETY_GUIDE', label: 'Safety guide' },
  { value: 'CERTIFICATION', label: 'Certification' },
] as const;

export const ASSEMBLY_TYPES = [
  { value: 'ASSEMBLY_GUIDE', label: 'Assembly guide' },
  { value: 'USAGE_GUIDE', label: 'Usage guide' },
  { value: 'INSTALLATION_GUIDE', label: 'Installation guide' },
  { value: 'MAINTENANCE_GUIDE', label: 'Maintenance guide' },
  { value: 'DISASSEMBLY_GUIDE', label: 'Disassembly guide' },
] as const;

export const AUDIO_TYPES = [
  { value: 'POWER_ON', label: 'Power on' },
  { value: 'IN_USE', label: 'In use' },
] as const;

export const LANGUAGES = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
  { value: 'it', label: 'Italiano' },
] as const;

// ícones dos cards de informação (mapeados para lucide-react no componente)
export const INFO_ICONS = [
  { value: 'lightbulb', label: 'Light' },
  { value: 'zap', label: 'Power / voltage' },
  { value: 'battery', label: 'Battery' },
  { value: 'shield', label: 'Safety' },
  { value: 'wrench', label: 'Tool' },
  { value: 'clock', label: 'Time' },
  { value: 'volume', label: 'Sound' },
  { value: 'ruler', label: 'Size' },
  { value: 'thermometer', label: 'Temperature' },
  { value: 'info', label: 'Information' },
] as const;

export const SPEC_TYPES: Record<string, string[]> = {
  Voltage: ['V'],
  Power: ['W', 'kW'],
  Current: ['A', 'mA'],
  'Battery capacity': ['Ah', 'mAh'],
  Speed: ['rpm'],
  Torque: ['Nm'],
  Weight: ['kg', 'g'],
  Length: ['mm', 'cm', 'm'],
  Noise: ['dB'],
  Capacity: ['L', 'mL'],
  Other: [],
};

export const MAX_GALLERY = 7;

export const STEPS = [
  { n: 1, title: 'Basic Information', sub: 'Product name, model, SKU, category, brand and description.' },
  { n: 2, title: 'Images & Media', sub: 'Product images, videos and 3D model' },
  { n: 3, title: 'Technical Information', sub: 'Specifications and technical details' },
  { n: 4, title: 'Manuals & Documents', sub: 'Product documentation' },
  { n: 5, title: 'Guides & Product Content', sub: 'Informations and assembly guides' },
  { n: 6, title: 'QR Codes', sub: 'QR Codes' },
  { n: 7, title: 'Product Review', sub: 'final review' },
] as const;

type Opt = { value: string; label: string };
export const labelOf = (list: readonly Opt[], value?: string | null) =>
  list.find((o) => o.value === value)?.label ?? value ?? '';

/** Lista de valores no formato que o z.enum() pede. */
export const tuple = <T extends readonly { value: string }[]>(list: T) =>
  list.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]];

// Listas usadas no formulário (cliente) e na validação (servidor).
// Os valores precisam ser iguais aos enums do schema.prisma.

export const CATEGORIES = [
  { value: 'ELECTRONICS', label: 'Eletrônicos' },
  { value: 'FURNITURE', label: 'Móveis' },
  { value: 'APPLIANCES', label: 'Eletrodomésticos' },
  { value: 'TOOLS', label: 'Ferramentas' },
  { value: 'AUTOMOTIVE', label: 'Automotivo' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'OTHER', label: 'Outros' },
] as const;

export const SUBCATEGORIES: Record<string, { value: string; label: string }[]> = {
  APPLIANCES: [
    { value: 'REFRIGERATOR', label: 'Geladeira' },
    { value: 'WASHER', label: 'Lavadora' },
    { value: 'MICROWAVE', label: 'Micro-ondas' },
  ],
  FURNITURE: [
    { value: 'WARDROBE', label: 'Guarda-roupa' },
    { value: 'TV_STAND', label: 'Rack para TV' },
    { value: 'DESK', label: 'Escrivaninha' },
  ],
  TOOLS: [
    { value: 'SCREWDRIVER', label: 'Parafusadeira' },
    { value: 'DRILL', label: 'Furadeira' },
    { value: 'SANDER', label: 'Lixadeira' },
  ],
  ELECTRONICS: [
    { value: 'TV', label: 'TV' },
    { value: 'SPEAKER', label: 'Caixa de som' },
    { value: 'HEADPHONES', label: 'Fones de ouvido' },
  ],
};

export const ALL_SUBCATEGORIES = Object.values(SUBCATEGORIES).flat();

export const DOCUMENT_TYPES = [
  { value: 'USER_MANUAL', label: 'Manual do usuário' },
  { value: 'ASSEMBLY_MANUAL', label: 'Manual de montagem' },
  { value: 'TECHNICAL_DATASHEET', label: 'Ficha técnica' },
  { value: 'INSTALLATION_GUIDE', label: 'Guia de instalação' },
  { value: 'MAINTENANCE_GUIDE', label: 'Guia de manutenção' },
  { value: 'WARRANTY_DOCUMENT', label: 'Termo de garantia' },
  { value: 'SAFETY_GUIDE', label: 'Guia de segurança' },
  { value: 'CERTIFICATION', label: 'Certificação' },
] as const;

export const ASSEMBLY_TYPES = [
  { value: 'ASSEMBLY_GUIDE', label: 'Guia de montagem' },
  { value: 'USAGE_GUIDE', label: 'Guia de uso' },
  { value: 'INSTALLATION_GUIDE', label: 'Guia de instalação' },
  { value: 'MAINTENANCE_GUIDE', label: 'Guia de manutenção' },
  { value: 'DISASSEMBLY_GUIDE', label: 'Guia de desmontagem' },
] as const;

export const AUDIO_TYPES = [
  { value: 'POWER_ON', label: 'Ao ligar' },
  { value: 'IN_USE', label: 'Em uso' },
] as const;

export const LANGUAGES = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en', label: 'Inglês' },
  { value: 'es', label: 'Espanhol' },
  { value: 'de', label: 'Alemão' },
  { value: 'fr', label: 'Francês' },
  { value: 'it', label: 'Italiano' },
] as const;

// ícones dos cards de informação (mapeados para lucide-react no componente)
export const INFO_ICONS = [
  { value: 'lightbulb', label: 'Luz' },
  { value: 'zap', label: 'Energia / tensão' },
  { value: 'battery', label: 'Bateria' },
  { value: 'shield', label: 'Segurança' },
  { value: 'wrench', label: 'Ferramenta' },
  { value: 'clock', label: 'Tempo' },
  { value: 'volume', label: 'Som' },
  { value: 'ruler', label: 'Tamanho' },
  { value: 'thermometer', label: 'Temperatura' },
  { value: 'info', label: 'Informação' },
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

// The keys above are saved in the database (in English); these are the names shown in the panel.
export const SPEC_TYPE_LABELS: Record<string, string> = {
  Voltage: 'Tensão',
  Power: 'Potência',
  Current: 'Corrente',
  'Battery capacity': 'Capacidade da bateria',
  Speed: 'Velocidade',
  Torque: 'Torque',
  Weight: 'Peso',
  Length: 'Comprimento',
  Noise: 'Ruído',
  Capacity: 'Capacidade',
  Other: 'Outra',
};

export const specTypeLabel = (name: string) => SPEC_TYPE_LABELS[name] ?? name;

export const MAX_GALLERY = 7;

export const STEPS = [
  { n: 1, title: 'Informações básicas', sub: 'Nome, modelo, SKU, categoria, marca e descrição do produto.' },
  { n: 2, title: 'Imagens e mídias', sub: 'Imagens, vídeos e modelo 3D do produto' },
  { n: 3, title: 'Informações técnicas', sub: 'Especificações e detalhes técnicos' },
  { n: 4, title: 'Manuais e documentos', sub: 'Documentação do produto' },
  { n: 5, title: 'Guias e conteúdo do produto', sub: 'Informações e guias de montagem' },
  { n: 6, title: 'QR Codes', sub: 'QR Codes' },
  { n: 7, title: 'Revisão do produto', sub: 'revisão final' },
] as const;

type Opt = { value: string; label: string };
export const labelOf = (list: readonly Opt[], value?: string | null) =>
  list.find((o) => o.value === value)?.label ?? value ?? '';

/** Lista de valores no formato que o z.enum() pede. */
export const tuple = <T extends readonly { value: string }[]>(list: T) =>
  list.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]];

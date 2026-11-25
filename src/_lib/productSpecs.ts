// Product specs as saved by the wizard (technicalSheet.specifications) and their pt-BR labels.

export type ProductSpec = { key: string; value: string; label: string };

// spec names are saved in English by the wizard (SPEC_TYPES)
const SPEC_LABELS: Record<string, string> = {
  Voltage: 'tensão',
  Power: 'potência',
  Current: 'corrente',
  'Battery capacity': 'bateria',
  Speed: 'rotação',
  Torque: 'torque',
  Weight: 'peso',
  Length: 'comprimento',
  Noise: 'ruído',
  Capacity: 'capacidade',
};

/** Valid specs ("12 V" + "tensão"), in the saved order. */
export function toSpecs(specs: unknown, max = Infinity): ProductSpec[] {
  if (!Array.isArray(specs)) return [];
  return specs
    .filter((s): s is { name: string; unit: string | null; value: string } =>
      Boolean(s && typeof s === 'object' && 'name' in s && 'value' in s && s.value))
    .slice(0, max)
    .map((s, i) => ({
      key: `${s.name}-${i}`,
      value: s.unit ? `${s.value} ${s.unit}` : String(s.value),
      label: SPEC_LABELS[s.name] ?? s.name.toLowerCase(),
    }));
}

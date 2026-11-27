import type { Ref } from 'react';
import type { ProductFull, Progress } from '@/_lib/productTypes';

/** Cada etapa expõe save(): o botão "Salvar e continuar" do assistente chama a etapa aberta. */
export type StepHandle = { save: () => Promise<boolean> };

export type StepProps = {
  product: ProductFull;
  onProgress: (p: Progress) => void;
  ref?: Ref<StepHandle>;
};

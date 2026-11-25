// Portuguese text helpers for the product assistant (local search, no external services).

/** lowercase, no accents, only letters/digits/spaces */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// common Portuguese words that carry no meaning for search (already without accents)
const STOPWORDS = new Set(
  (
    'a o as os um uma uns umas de da do das dos em na no nas nos por pela pelo pelas pelos para pra ' +
    'com sem sob sobre ate e ou mas que se ja nao sim mais menos muito muita muitos muitas pouco ' +
    'qual quais quanto quanta quantos quantas como onde quando porque por que quem cujo ' +
    'eu tu ele ela nos vos eles elas me te lhe meu minha seu sua seus suas esse essa esses essas ' +
    'este esta estes estas isso isto aquele aquela aquilo ao aos a la lo ' +
    'ser sao sou e era foi esta estao estou tem ter tenho tinha ha havia fazer faz faco posso pode podem ' +
    'devo deve devem preciso precisa vou vai la aqui ai entao tambem so apenas cada todo toda todos todas ' +
    'voce voces gostaria queria quero saber dizer diga me fale explique ola oi ferramenta produto ' +
    'dela dele deles delas nele nela neles nelas num numa algum alguma usar utilizar uso usando'
  ).split(' '),
);

/** Light Portuguese stemmer: strips the most common inflection endings. */
export function stem(word: string): string {
  if (word.length <= 4 || /^\d/.test(word)) return word;
  const rules: [RegExp, string][] = [
    [/(amentos|imentos|amento|imento)$/, ''],
    [/(acoes|icoes|acao|icao)$/, ''],
    [/(mente)$/, ''],
    [/(ando|endo|indo|ado|ido|ada|ida|ados|idos|adas|idas)$/, ''],
    [/(oes|aes)$/, ''],
    [/(eis|ais)$/, ''],
    [/(ar|er|ir)$/, ''],
    [/(es)$/, ''],
    [/(s)$/, ''],
    [/(a|o|e)$/, ''],
  ];
  for (const [re, rep] of rules) {
    const next = word.replace(re, rep);
    if (next !== word && next.length >= 3) return next;
  }
  return word;
}

/** Meaningful stems of a text. */
export function terms(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((w) => w && !STOPWORDS.has(w) && (w.length > 1 || /\d/.test(w)))
    .map(stem);
}

/**
 * Domain synonyms: each group is matched as one concept. The first word of a group is the
 * canonical term added to the query when any member appears.
 */
const SYNONYM_GROUPS = [
  'tensao voltagem volt volts v',
  'bateria acumulador ah carga autonomia',
  'carregador carregar carrega recarregar recarga',
  'rotacao rpm velocidade giro gira girar',
  'torque forca aperto apertar nm',
  'peso pesa pesado leve quilo quilos kg grama gramas',
  'dimensao dimensoes tamanho medida medidas altura largura comprimento',
  'material feito fabricado plastico metal',
  'potencia watt watts w',
  'ruido barulho som db decibel decibeis',
  'luz led lanterna iluminacao iluminar',
  'broca brocas bit bits ponteira ponteiras',
  'mandril encaixe',
  'seguranca perigo risco cuidado proteger protecao',
  'limpeza limpar limpo manutencao conservar',
  'garantia assistencia conserto reparo',
  'ligar desligar interruptor gatilho botao acionar',
  'sentido rotacao direita esquerda reversao reverso inverter',
  'montar montagem instalar instalacao encaixar colocar',
  'remover retirar tirar soltar',
  'agua chuva umidade humidade molhado molhada molhar',
  'calor quente esquentar esquenta aquecer aquece temperatura superaquecimento',
];

const GROUPS = SYNONYM_GROUPS.map((g) => g.split(' ').map(stem));
const GROUP_OF = new Map<string, number>();
GROUPS.forEach((g, i) => g.forEach((t) => GROUP_OF.set(t, i)));

/**
 * Query concepts: each meaningful word of the question with its domain synonyms. A concept counts
 * once however many of its synonyms a text contains, so synonyms don't inflate the score.
 */
export function concepts(queryTerms: string[]): string[][] {
  const seen = new Set<string>();
  const out: string[][] = [];
  for (const t of queryTerms) {
    const g = GROUP_OF.get(t);
    const members = g === undefined ? [t] : [...new Set([t, ...GROUPS[g]])];
    const key = g === undefined ? `t:${t}` : `g:${g}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(members);
  }
  return out;
}

/** Whether two stems should count as the same word (exact, or one is a prefix of the other). */
export function sameTerm(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.length < 4 || b.length < 4) return false;
  return a.startsWith(b) || b.startsWith(a);
}

/** Splits text into sentences (keeps the punctuation). */
export function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?;])\s+(?=[A-ZÀ-Ú0-9"“(•\-])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

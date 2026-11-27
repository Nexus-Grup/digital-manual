'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Box,
  Building2,
  CircleHelp,
  EllipsisVertical,
  ListChecks,
  Package,
  Send,
  Tags,
} from 'lucide-react';
import styles from '@/_styles/cssUserPanelPage/PanelHelp.module.css';
import { Modal } from './Modal';

type Step = {
  icon: ReactNode;
  title: string;
  /** where to click, with the exact names shown on screen */
  where: ReactNode;
  text: ReactNode;
  tip?: ReactNode;
};

// Exact labels of the panel (menus, buttons), so people recognize them on screen.
const STEPS: Step[] = [
  {
    icon: <Building2 size={20} aria-hidden />,
    title: 'Cadastre a empresa',
    where: <>Menu <strong>Empresas</strong> → <strong>Nova empresa</strong></>,
    text: 'Preencha o nome, a descrição, o site e o logo e clique em Criar empresa. Quem cria a empresa vira o proprietário dela.',
    tip: 'Tudo no painel nasce da empresa: sem ela não dá para criar marcas nem produtos.',
  },
  {
    icon: <Tags size={20} aria-hidden />,
    title: 'Cadastre a marca',
    where: <>Menu <strong>Marcas</strong> → <strong>Nova marca</strong></>,
    text: 'Escolha a empresa, dê um nome à marca e envie o logo. Depois, em Usuários da marca, você pode convidar quem vai cuidar dos produtos dela.',
    tip: 'Uma empresa pode ter várias marcas, e cada produto pertence a uma marca.',
  },
  {
    icon: <Package size={20} aria-hidden />,
    title: 'Crie o produto',
    where: <>Menu <strong>Produtos</strong> → <strong>Adicionar produto</strong></>,
    text: 'Na primeira etapa, informe nome, modelo, SKU, categoria e a marca. Ao salvar, o produto é criado como rascunho e o assistente segue para as próximas etapas.',
  },
  {
    icon: <Box size={20} aria-hidden />,
    title: 'Envie as fotos e gere a imagem 360°',
    where: <>Etapa <strong>Imagens e mídias</strong></>,
    text: (
      <>
        Envie a imagem principal e as fotos da galeria (o fundo é removido automaticamente). Em Modelo 3D, clique em{' '}
        <strong>Gerar a partir da imagem principal</strong> (ou das fotos selecionadas). A geração leva de 1 a 3 minutos:
        fique na etapa até aparecer “Modelo 3D gerado” e clique em <strong>Salvar e continuar</strong>.
      </>
    ),
    tip: 'Para um 3D melhor, use fotos do produto inteiro (frente, lados e verso) e desmarque os closes de detalhes.',
  },
  {
    icon: <ListChecks size={20} aria-hidden />,
    title: 'Complete o cadastro até 100%',
    where: <>Etapas <strong>Informações técnicas</strong>, <strong>Manuais e documentos</strong>, <strong>Guias e conteúdo do produto</strong> e <strong>QR Codes</strong></>,
    text: 'Preencha a ficha técnica, envie o manual em PDF, monte o passo a passo de montagem e gere o QR Code da embalagem. A barra “Conteúdo preenchido” mostra o andamento; com tudo preenchido, o produto aparece como Completo na lista.',
    tip: 'Você pode parar e voltar depois: cada etapa é salva ao clicar em Salvar e continuar.',
  },
  {
    icon: <Send size={20} aria-hidden />,
    title: 'Publique o produto',
    where: (
      <>
        Menu <strong>Produtos</strong> → <EllipsisVertical size={14} aria-label="três pontinhos" className={styles['panel-help__inline-icon']} /> do
        produto → <strong>Ver detalhes</strong> → <strong>Publicar produto</strong>
      </>
    ),
    text: 'Enquanto é rascunho, o manual não aparece para o público. Ao publicar, ele passa a abrir pelo QR Code e pela busca do site. Para tirar do ar, use Voltar para rascunho no mesmo lugar.',
    tip: 'Publique só depois de chegar a 100%, para o cliente encontrar o manual completo.',
  },
];

/** "?" button in the panel header: step-by-step guide of the whole flow (company → brand → product → publish). */
export function PanelHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles['panel-help__trigger']}
        aria-haspopup="dialog"
        aria-label="Ajuda: como usar o painel"
        title="Como usar o painel"
        onClick={() => setOpen(true)}
      >
        <CircleHelp size={22} strokeWidth={1.9} aria-hidden />
      </button>

      {open && (
        <Modal label="Como usar o painel" onClose={() => setOpen(false)}>
          <div className={styles['panel-help']}>
            <header className={styles['panel-help__header']}>
              <h2 className={styles['panel-help__title']}>Como usar o painel</h2>
              <p className={styles['panel-help__lead']}>
                O cadastro segue uma ordem: primeiro a empresa, depois a marca e, dentro da marca, os produtos. Siga os passos abaixo.
              </p>
            </header>

            <ol className={styles['panel-help__steps']}>
              {STEPS.map((step, index) => (
                <li className={styles['panel-help__step']} key={step.title}>
                  <span className={styles['panel-help__number']} aria-hidden="true">{index + 1}</span>
                  <div className={styles['panel-help__content']}>
                    <h3 className={styles['panel-help__step-title']}>
                      <span className={styles['panel-help__step-icon']}>{step.icon}</span>
                      {step.title}
                    </h3>
                    <p className={styles['panel-help__where']}>{step.where}</p>
                    <p className={styles['panel-help__text']}>{step.text}</p>
                    {step.tip && <p className={styles['panel-help__tip']}>{step.tip}</p>}
                  </div>
                </li>
              ))}
            </ol>

            <footer className={styles['panel-help__footer']}>
              <p className={styles['panel-help__footer-text']}>
                Não encontrou o menu Empresas ou Marcas? Eles aparecem conforme o seu papel: empresas para o proprietário e marcas para
                proprietário ou gerente.
              </p>
              <Link className={styles['panel-help__support']} href="/painel/suporte" onClick={() => setOpen(false)}>
                Ainda com dúvida? Fale com o suporte
              </Link>
            </footer>
          </div>
        </Modal>
      )}
    </>
  );
}

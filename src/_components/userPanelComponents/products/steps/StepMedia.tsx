'use client';

import { useId, useImperativeHandle, useState } from 'react';
import { Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import styles from '@/_styles/cssUserPanelPage/products/ProductWizard.module.css';
import { AUDIO_TYPES, MAX_GALLERY, labelOf } from '@/_lib/productConstants';
import type { AudioDTO, Progress, VideoDTO } from '@/_lib/productTypes';
import { UploadBox } from '../UploadBox';
import { api, fileNameFromUrl } from '../productApi';
import type { StepProps } from './stepTypes';

const EMPTY_VIDEO = { title: '', url: '', code: '', description: '' };

export function StepMedia({ product, onProgress, ref }: StepProps) {
  const uid = useId();
  const [imgUrl, setImgUrl] = useState<string | null>(product.imgUrl);
  const [gallery, setGallery] = useState<string[]>(product.gallery);
  const [model, setModel] = useState(product.model3dUrl ?? '');
  const [generating, setGenerating] = useState(false);
  const [modelStatus, setModelStatus] = useState('');
  // photos left out of the 3D generation (close-ups confuse it); the main image is always used
  const [modelExcluded, setModelExcluded] = useState<string[]>([]);
  const [videos, setVideos] = useState<VideoDTO[]>(product.videos);
  const [audios, setAudios] = useState<AudioDTO[]>(product.audios);

  const [showVideo, setShowVideo] = useState(false);
  const [video, setVideo] = useState(EMPTY_VIDEO);
  const [showAudio, setShowAudio] = useState(false);
  const [audioType, setAudioType] = useState<AudioDTO['audioType'] | ''>('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const setGallerySlot = (i: number, url: string | null) =>
    setGallery((g) => (url ? (i < g.length ? g.map((x, k) => (k === i ? url : x)) : [...g, url]) : g.filter((_, k) => k !== i)));

  function addVideo(list = videos) {
    if (!video.title.trim() || !video.url.trim()) {
      toast.error('Digite o título e a URL do vídeo');
      return null;
    }
    const next = [...list, { title: video.title.trim(), url: video.url.trim(), code: video.code.trim() || null, description: video.description.trim() || null }];
    setVideos(next);
    setVideo(EMPTY_VIDEO);
    return next;
  }

  function addAudio(list = audios) {
    if (!audioType || !audioUrl) {
      toast.error('Selecione o tipo de áudio e envie o arquivo');
      return null;
    }
    const next = [...list, { audioUrl, audioType }];
    setAudios(next);
    setAudioUrl(null);
    setAudioType('');
    return next;
  }

  // main image first, then the gallery: the views offered to the 3D generation
  const viewImages = imgUrl ? [imgUrl, ...gallery.filter((u) => u !== imgUrl)] : [];
  const modelImages = viewImages.filter((u, i) => i === 0 || !modelExcluded.includes(u));
  const toggleModelImage = (url: string) =>
    setModelExcluded((list) => (list.includes(url) ? list.filter((u) => u !== url) : [...list, url]));

  // image-to-3D (TRELLIS on Hugging Face, ~1–3 min): one photo, or several views of the same product
  // (multi-image mode). The .glb is stored like an upload and saved with the rest of the media.
  async function generateModel() {
    if (modelImages.length === 0 || generating) return;
    setGenerating(true);
    setModelStatus(
      modelImages.length > 1
        ? `Gerando o modelo 3D a partir de ${modelImages.length} fotos. Leva cerca de 1–3 minutos, permaneça nesta etapa.`
        : 'Gerando o modelo 3D a partir da imagem principal. Leva cerca de 1–2 minutos, permaneça nesta etapa.',
    );
    const r = await api<{ url: string }>(`/api/products/${product.id}/model3d`, 'POST', { imageUrls: modelImages });
    setGenerating(false);
    if (!r.ok) {
      setModelStatus(r.error);
      toast.error(r.error);
      return;
    }
    setModel(r.data.url);
    setModelStatus('Modelo 3D gerado. Salve esta etapa para publicá-lo.');
    toast.success('Modelo 3D gerado.');
  }

  async function save() {
    // o que já foi preenchido nos formulários abertos entra junto
    let v = videos, a = audios;
    if (video.title.trim() || video.url.trim()) { const n = addVideo(); if (!n) return false; v = n; }
    if (audioUrl) { const n = addAudio(); if (!n) return false; a = n; }

    const r = await api<{ progress: Progress }>(`/api/products/${product.id}/media`, 'PUT', {
      imgUrl, gallery, model3dUrl: model.trim() || null, videos: v, audios: a,
    });
    if (!r.ok) return void toast.error(r.error), false;
    onProgress(r.data.progress);
    toast.success('Imagens e mídias salvas.');
    return true;
  }

  useImperativeHandle(ref, () => ({ save }));

  return (
    <div className={styles.stack}>
      <div className={styles.field}>
        <span className={styles.label}>Imagem principal do produto</span>
        <UploadBox productId={product.id} kind="image" cutout value={imgUrl} onChange={setImgUrl} title="Enviar imagem principal" hint="PNG, JPG ou WEBP · o fundo é removido automaticamente" />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Galeria do produto</span>
        <div className={styles.gallery}>
          {Array.from({ length: MAX_GALLERY }, (_, i) => (
            <UploadBox key={i} compact cutout productId={product.id} kind="image" value={gallery[i] ?? null} onChange={(u) => setGallerySlot(i, u)} title="Adicionar imagem" hint="PNG, JPG ou WEBP" />
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Modelo 3D</span>
        <UploadBox productId={product.id} kind="model" value={null} onChange={(u) => u && setModel(u)} title="Envie ou informe a URL do modelo 3D" hint="Arquivo GLB, ou cole um link abaixo" />
        <input id={`${uid}-model`} className={styles.input} aria-label="URL do modelo 3D" placeholder="https://..." value={model} onChange={(e) => setModel(e.target.value)} />
        {viewImages.length > 1 && (
          <fieldset className={styles.modelViews} disabled={generating}>
            <legend className={styles.modelViewsLegend}>Fotos usadas no modelo 3D</legend>
            <ul className={styles.modelViewsList}>
              {viewImages.map((src, i) => {
                const main = i === 0;
                const on = main || !modelExcluded.includes(src);
                return (
                  <li key={src}>
                    <label className={`${styles.modelView} ${on ? styles.modelViewOn : ''}`}>
                      <input
                        type="checkbox"
                        className={styles.srOnly}
                        checked={on}
                        disabled={main}
                        onChange={() => toggleModelImage(src)}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className={styles.modelViewImg} />
                      <span className={styles.modelViewLabel}>{main ? 'Imagem principal' : `Galeria ${i}`}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <p className={styles.generateStatus}>
              Keep full views of the product (front, sides, back) and uncheck close-ups of details: they distort the model.
            </p>
          </fieldset>
        )}
        <div className={styles.generateRow}>
          <button
            type="button"
            className={styles.pillBtn}
            onClick={generateModel}
            disabled={modelImages.length === 0 || generating}
            aria-describedby={`${uid}-model-status`}
          >
            {generating ? <Loader2 size={14} className={styles.spin} aria-hidden /> : <Sparkles size={14} aria-hidden />}
            {generating
              ? 'Gerando modelo 3D…'
              : `${model ? 'Gerar novamente' : 'Gerar'} a partir ${modelImages.length > 1 ? `de ${modelImages.length} fotos` : 'da imagem principal'}`}
          </button>
          <p id={`${uid}-model-status`} className={styles.generateStatus} role="status">
            {modelStatus || (imgUrl
              ? 'Cria um modelo 360° a partir das fotos selecionadas. Mais ângulos do mesmo produto melhoram as laterais e o verso.'
              : 'Envie a imagem principal para gerar um modelo 3D a partir dela.')}
          </p>
        </div>
      </div>

      {/* ---------- vídeos ---------- */}
      <div className={styles.sectionHead}>
        <span className={styles.label}>Vídeos do produto no YouTube</span>
        <button type="button" className={styles.pillBtn} onClick={() => setShowVideo((s) => !s)} aria-expanded={showVideo}>Adicionar vídeo</button>
      </div>

      {showVideo && (
        <div className={styles.builder}>
          <div className={styles.field}><label htmlFor={`${uid}-vt`}>Título do vídeo</label><input id={`${uid}-vt`} className={styles.input} placeholder="Título do vídeo" value={video.title} maxLength={160} onChange={(e) => setVideo({ ...video, title: e.target.value })} /></div>
          <div className={styles.field}><label htmlFor={`${uid}-vu`}>URL do vídeo</label><input id={`${uid}-vu`} className={styles.input} type="url" placeholder="Cole a URL do vídeo" value={video.url} onChange={(e) => setVideo({ ...video, url: e.target.value })} /></div>
          <div className={styles.field}><label htmlFor={`${uid}-vc`}>Código do vídeo</label><input id={`${uid}-vc`} className={styles.input} placeholder="Código do vídeo" value={video.code} maxLength={80} onChange={(e) => setVideo({ ...video, code: e.target.value })} /></div>
          <div className={styles.field}><label htmlFor={`${uid}-vd`}>Descrição</label><textarea id={`${uid}-vd`} className={styles.textarea} placeholder="Descreva o vídeo..." value={video.description} maxLength={1000} onChange={(e) => setVideo({ ...video, description: e.target.value })} /></div>
          <div className={styles.builderActions}><button type="button" className={styles.pillBtn} onClick={() => addVideo()}><Plus size={13} aria-hidden /> Adicionar</button></div>
        </div>
      )}

      {videos.length > 0 && (
        <section className={styles.added} aria-label="Vídeos adicionados">
          <h3 className={styles.addedTitle}>Vídeos adicionados</h3>
          <ul>
            {videos.map((v, i) => (
              <li key={i}>
                <span className={styles.addedText}><span>{v.title}</span><small>{v.url}</small></span>
                <button type="button" className={styles.iconBtn} aria-label={`Remover ${v.title}`} onClick={() => setVideos(videos.filter((_, k) => k !== i))}><Trash2 size={14} aria-hidden /></button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- áudio ---------- */}
      <div className={styles.sectionHead}>
        <span className={styles.label}>Áudios do produto</span>
        <button type="button" className={styles.pillBtn} onClick={() => setShowAudio((s) => !s)} aria-expanded={showAudio}>Adicionar áudio</button>
      </div>

      {showAudio && (
        <div className={styles.builder}>
          <div className={styles.field}>
            <label htmlFor={`${uid}-at`}>Tipo de áudio</label>
            <select id={`${uid}-at`} className={styles.select} value={audioType} onChange={(e) => setAudioType(e.target.value as AudioDTO['audioType'])}>
              <option value="">Selecione o tipo de áudio</option>
              {AUDIO_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Áudio do produto</span>
            <UploadBox productId={product.id} kind="audio" value={audioUrl} onChange={setAudioUrl} title="Enviar áudio" hint="MP3, WAV ou OGG" />
          </div>
          <div className={styles.builderActions}><button type="button" className={styles.pillBtn} onClick={() => addAudio()}><Plus size={13} aria-hidden /> Adicionar</button></div>
        </div>
      )}

      {audios.length > 0 && (
        <section className={styles.added} aria-label="Áudios adicionados">
          <h3 className={styles.addedTitle}>Áudios adicionados</h3>
          <ul>
            {audios.map((a, i) => (
              <li key={i}>
                <span className={styles.addedText}><span>{fileNameFromUrl(a.audioUrl)}</span><small>{labelOf(AUDIO_TYPES, a.audioType)}</small></span>
                <button type="button" className={styles.iconBtn} aria-label={`Remover ${fileNameFromUrl(a.audioUrl)}`} onClick={() => setAudios(audios.filter((_, k) => k !== i))}><Trash2 size={14} aria-hidden /></button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

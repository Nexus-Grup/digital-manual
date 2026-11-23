'use client';

import { useId, useImperativeHandle, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
      toast.error('Enter the video title and URL');
      return null;
    }
    const next = [...list, { title: video.title.trim(), url: video.url.trim(), code: video.code.trim() || null, description: video.description.trim() || null }];
    setVideos(next);
    setVideo(EMPTY_VIDEO);
    return next;
  }

  function addAudio(list = audios) {
    if (!audioType || !audioUrl) {
      toast.error('Select the audio type and upload the file');
      return null;
    }
    const next = [...list, { audioUrl, audioType }];
    setAudios(next);
    setAudioUrl(null);
    setAudioType('');
    return next;
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
    toast.success('Images & media saved.');
    return true;
  }

  useImperativeHandle(ref, () => ({ save }));

  return (
    <div className={styles.stack}>
      <div className={styles.field}>
        <span className={styles.label}>Main Product Image</span>
        <UploadBox productId={product.id} kind="image" value={imgUrl} onChange={setImgUrl} title="Upload main image" hint="PNG, JPG OR WEBP" />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Product Gallery</span>
        <div className={styles.gallery}>
          {Array.from({ length: MAX_GALLERY }, (_, i) => (
            <UploadBox key={i} compact productId={product.id} kind="image" value={gallery[i] ?? null} onChange={(u) => setGallerySlot(i, u)} title="Add image" hint="PNG, JPG or WEBP" />
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>3D Model</span>
        <UploadBox productId={product.id} kind="model" value={null} onChange={(u) => u && setModel(u)} title="Upload or add 3D model URL" hint="GLB file, or paste a link below" />
        <input id={`${uid}-model`} className={styles.input} aria-label="3D model URL" placeholder="https://..." value={model} onChange={(e) => setModel(e.target.value)} />
      </div>

      {/* ---------- vídeos ---------- */}
      <div className={styles.sectionHead}>
        <span className={styles.label}>Add product youtube videos</span>
        <button type="button" className={styles.pillBtn} onClick={() => setShowVideo((s) => !s)} aria-expanded={showVideo}>Add Video</button>
      </div>

      {showVideo && (
        <div className={styles.builder}>
          <div className={styles.field}><label htmlFor={`${uid}-vt`}>Title video</label><input id={`${uid}-vt`} className={styles.input} placeholder="Title video" value={video.title} maxLength={160} onChange={(e) => setVideo({ ...video, title: e.target.value })} /></div>
          <div className={styles.field}><label htmlFor={`${uid}-vu`}>Video URL</label><input id={`${uid}-vu`} className={styles.input} type="url" placeholder="Paste video URL" value={video.url} onChange={(e) => setVideo({ ...video, url: e.target.value })} /></div>
          <div className={styles.field}><label htmlFor={`${uid}-vc`}>Code video</label><input id={`${uid}-vc`} className={styles.input} placeholder="Video code" value={video.code} maxLength={80} onChange={(e) => setVideo({ ...video, code: e.target.value })} /></div>
          <div className={styles.field}><label htmlFor={`${uid}-vd`}>Description</label><textarea id={`${uid}-vd`} className={styles.textarea} placeholder="Describe video ...." value={video.description} maxLength={1000} onChange={(e) => setVideo({ ...video, description: e.target.value })} /></div>
          <div className={styles.builderActions}><button type="button" className={styles.pillBtn} onClick={() => addVideo()}><Plus size={13} aria-hidden /> Add</button></div>
        </div>
      )}

      {videos.length > 0 && (
        <section className={styles.added} aria-label="Added videos">
          <h3 className={styles.addedTitle}>Added videos</h3>
          <ul>
            {videos.map((v, i) => (
              <li key={i}>
                <span className={styles.addedText}><span>{v.title}</span><small>{v.url}</small></span>
                <button type="button" className={styles.iconBtn} aria-label={`Remove ${v.title}`} onClick={() => setVideos(videos.filter((_, k) => k !== i))}><Trash2 size={14} aria-hidden /></button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- áudio ---------- */}
      <div className={styles.sectionHead}>
        <span className={styles.label}>Add product audio</span>
        <button type="button" className={styles.pillBtn} onClick={() => setShowAudio((s) => !s)} aria-expanded={showAudio}>Add Audio</button>
      </div>

      {showAudio && (
        <div className={styles.builder}>
          <div className={styles.field}>
            <label htmlFor={`${uid}-at`}>Type audio</label>
            <select id={`${uid}-at`} className={styles.select} value={audioType} onChange={(e) => setAudioType(e.target.value as AudioDTO['audioType'])}>
              <option value="">Select type audio</option>
              {AUDIO_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Product Audio</span>
            <UploadBox productId={product.id} kind="audio" value={audioUrl} onChange={setAudioUrl} title="Upload audio" hint="MP3, WAV or OGG" />
          </div>
          <div className={styles.builderActions}><button type="button" className={styles.pillBtn} onClick={() => addAudio()}><Plus size={13} aria-hidden /> Add</button></div>
        </div>
      )}

      {audios.length > 0 && (
        <section className={styles.added} aria-label="Added audio">
          <h3 className={styles.addedTitle}>Added audio</h3>
          <ul>
            {audios.map((a, i) => (
              <li key={i}>
                <span className={styles.addedText}><span>{fileNameFromUrl(a.audioUrl)}</span><small>{labelOf(AUDIO_TYPES, a.audioType)}</small></span>
                <button type="button" className={styles.iconBtn} aria-label={`Remove ${fileNameFromUrl(a.audioUrl)}`} onClick={() => setAudios(audios.filter((_, k) => k !== i))}><Trash2 size={14} aria-hidden /></button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

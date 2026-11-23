export type ProductStatus = 'DRAFT' | 'PUBLISHED';
export type StepKey = 'media' | 'technical' | 'manuals' | 'guides' | 'qr';

export type Progress = {
  completion: number; // 0-100
  steps: Record<StepKey, boolean>;
  updatedAt: string;
};

export type ProductListItem = {
  id: number;
  name: string;
  code: string;
  imgUrl: string | null;
  category: string;
  subcategory: string | null;
  status: ProductStatus;
  updatedAt: string;
  brandId: number;
  brandName: string;
  companyName: string;
  completion: number;
  complete: boolean;
  canEdit: boolean;
};

export type ListSummary = { all: number; published: number; draft: number; incomplete: number; complete: number };

export type BrandOption = { id: number; name: string; companyId: number; companyName: string };

export type VideoDTO = { title: string; url: string; code: string | null; description: string | null };
export type AudioDTO = { audioUrl: string; audioType: 'POWER_ON' | 'IN_USE' };
export type SpecDTO = { name: string; unit: string | null; value: string };
export type TechnicalDTO = {
  title: string;
  description: string | null;
  material: string | null;
  dimensions: string | null;
  weight: number | null;
  specs: SpecDTO[];
};
export type ManualDTO = {
  title: string;
  fileUrl: string;
  documentType: string;
  language: string | null;
  version: string | null;
};
export type InfoCardDTO = { title: string; icon: string | null; description: string | null };
export type InformationDTO = { title: string; description: string | null; cards: InfoCardDTO[] };
export type GuideStepDTO = { title: string; description: string | null; imageUrl: string | null };
export type AssemblyDTO = {
  title: string;
  type: string;
  description: string | null;
  imageUrl: string | null;
  steps: GuideStepDTO[];
};
export type QrDTO = { id: number; value: string; url: string | null; isActive: boolean; createdAt: string };

export type ProductFull = {
  id: number;
  name: string;
  model: string | null;
  code: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  brandId: number;
  brandName: string;
  companyName: string;
  status: ProductStatus;
  updatedAt: string;
  canEdit: boolean;
  progress: Progress;
  imgUrl: string | null;
  gallery: string[];
  model3dUrl: string | null;
  videos: VideoDTO[];
  audios: AudioDTO[];
  technical: TechnicalDTO | null;
  manuals: ManualDTO[];
  information: InformationDTO | null;
  assemblies: AssemblyDTO[];
  qrCodes: QrDTO[];
  stats: { views: number; qrScans: number; downloads: number; landing: number };
};

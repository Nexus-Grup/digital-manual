import type {
  TicketAbout,
  TicketCategory,
  TicketPriority,
  TicketStatus,
} from "@prisma/client";
import type { AdminView } from "./constants";

export type Related = { name: string; kind: string };

export type UploadedFile = {
  fileUrl: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
};

export type TicketListItem = {
  id: number;
  title: string;
  status: TicketStatus;
  lastMessageAt: string;
  related: Related;
};

export type TicketMessageView = {
  id: number;
  body: string;
  createdAt: string;
  fromSupport: boolean;
  isInternal: boolean;
  authorName: string;
  attachments: { id: number; fileName: string; fileUrl: string }[];
};

export type TicketDetailView = {
  id: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  about: TicketAbout;
  related: Related;
  hasAssignee: boolean;
  createdAt: string;
  messages: TicketMessageView[];
};

type Option = { id: number; name: string };
export type TicketTargets = { products: Option[]; brands: Option[]; companies: Option[] };

// ----- Admin -----
export type AdminTicketListItem = {
  id: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  lastMessageAt: string;
  related: Related;
  requesterName: string;
  assigneeName: string | null;
};

export type AdminInbox = {
  items: AdminTicketListItem[];
  total: number;
  page: number;
  pageSize: number;
  counts: Record<AdminView, number>;
  companies: Option[];
  brands: (Option & { companyId: number })[];
};

export type AdminTicketDetailView = {
  id: number;
  title: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: string;
  requester: { name: string; email: string };
  assigneeName: string | null;
  product: string | null;
  brand: string | null;
  company: string | null;
  messages: TicketMessageView[];
};

export interface DocumentsInterface {
  documentId: string;
  patientName: string;
  documentName: string;
  createdAt: string;
  internalComment: string;
  reviewerId: string;
  documents: DocumentsMetaDataInterface;
  status: "Pending" | "Completed";
}

export interface DocumentsResponseInterface {
  data: DocumentsInterface[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface DocumentsMetaDataInterface {
  images: File;
  documentId: string;
  documentName: string;
  document_type: string;
  documents: string[];
  notes?: string;
  file_for_review?: boolean;
  provderId: string;
  userDetailsId: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type UploadDocumentType = Omit<
  DocumentsMetaDataInterface,
  "createdAt" | "updatedAt" | "documentId" | "documents" | "documentName"
>;

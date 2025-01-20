export interface DocumentsInterface {
  documentId: string;
  patientName: string;
  documentName: string;
  createdAt: string;
  internalComment: string;
  reviewerId: string;
  documents: string[];
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
  documentName: string;
  documentId: string;
  tests: string[];
  status: string;
  createdAt: string;
}

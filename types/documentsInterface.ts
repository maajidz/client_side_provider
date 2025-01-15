export interface DocumentsInterface {
  id: string;
  patientName: string;
  documentName: string;
  createdAt: string;
  internalComment: string;
  reviewerId: string;
  status: "Pending" | "Completed";
}
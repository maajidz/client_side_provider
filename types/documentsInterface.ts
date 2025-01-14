export interface DocumentsInterface {
  id: string;
  patient: string;
  documentName: string;
  date: string;
  internalComments: string;
  reviewer: string;
  status: "Signed" | "Un-Signed"
}
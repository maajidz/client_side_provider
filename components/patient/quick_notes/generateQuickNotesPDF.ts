import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { QuickNotesInterface } from "@/types/quickNotesInterface";

const generateQuickNotesPDF = ({
  quickNotesData,
}: {
  quickNotesData: QuickNotesInterface;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  doc.setFontSize(12);
  doc.text("Pomegranate Health", pageWidth - 10, 10, { align: "right" });
  doc.text("30 N Gould Street", pageWidth - 10, 15, { align: "right" });
  doc.text("Ste R, Sheridan, Wyoming - 82801", pageWidth - 10, 20, {
    align: "right",
  });

  autoTable(doc, {
    startY: 40,
    head: [["Note", "Added by", "Date"]],
    body: [
      [
        quickNotesData.note,
        quickNotesData.providerDetails.id,
        quickNotesData.createdAt,
      ],
    ],
    styles: {
      cellPadding: 3,
      fontSize: 10,
      halign: "center",
    },
    headStyles: {
      fillColor: "#84012A",
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  });

  doc.save("Patient_Notes.pdf");
};

export default generateQuickNotesPDF;


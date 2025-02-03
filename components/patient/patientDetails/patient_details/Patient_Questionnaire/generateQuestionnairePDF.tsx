import { QuestionnaireData } from "@/types/formInterface";
import jsPDF from "jspdf";

export async function generateQuestionnairePDF({
  data,
}: {
  data: QuestionnaireData[];
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let y = 40;

  doc.setFontSize(12);
  doc.text("Pomegranate Health", pageWidth - 10, 10, { align: "right" });
  doc.text("30 N Gould Street", pageWidth - 10, 15, { align: "right" });
  doc.text("Ste R, Sheridan, Wyoming - 82801", pageWidth - 10, 20, {
    align: "right",
  });

  doc.line(10, 25, pageWidth - 10, 25);

  doc.setFontSize(14);
  doc.text("Patient Questionnaire", 10, 35);

  doc.setFontSize(12);
  data.forEach((item, index) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.text(`${index + 1}. ${item.questionText}`, 10, y);
    y += 7;

    doc.text(`Answer: ${item.answerText}`, 15, y);
    y += 10;
  });

  doc.save("Patient_Questionnaire.pdf");
}

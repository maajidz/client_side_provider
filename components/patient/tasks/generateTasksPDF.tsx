import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TasksResponseDataInterface } from "@/types/tasksInterface";

const generateTasksPDF = ({
  tasksData,
}: {
  tasksData: TasksResponseDataInterface;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Header Section
  doc.setFontSize(12);
  doc.text("Pomegranate Health", pageWidth - 10, 10, { align: "right" });
  doc.text("30 N Gould Street", pageWidth - 10, 15, { align: "right" });
  doc.text("Ste R, Sheridan, Wyoming - 82801", pageWidth - 10, 20, {
    align: "right",
  });

  doc.line(10, 25, pageWidth - 10, 25);

  doc.setFontSize(14);
  doc.text("Patient Tasks", 10, 35);

  autoTable(doc, {
    startY: 40,
    head: [["Task ID", "Category", "Status", "Priority"]], 
    body:  [[
      tasksData.id ?? "",
      tasksData.categoryId ?? "",
      tasksData.status ?? "",
      tasksData.priority ?? "",
    ]],
    theme: "grid",
    styles: { fontSize: 12, lineColor: "#84012A" },
    headStyles: {
      fillColor: "#84012A",
      fontSize: 14,
      fontStyle: "bold",
      textColor: "#FFFFFF",
    },
  });

  doc.save("Patient_Tasks.pdf");
};

export default generateTasksPDF;

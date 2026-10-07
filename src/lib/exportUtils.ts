import { jsPDF } from "jspdf";
import { mockChild, mockAssessments } from "./mockData";

export const downloadCSV = () => {
  const headers = ["Date, Oral Hygiene Score, Dietary Risk Score, Sensory Difficulty Score, Independence Score\n"];
  
  const rows = mockAssessments.map(a => 
    `${a.date}, ${a.oral_hygiene_score}, ${a.dietary_risk_score}, ${a.sensory_difficulty_score}, ${a.independence_score}`
  ).join("\n");

  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${mockChild.participant_code}_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPDF = () => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text("ASD Oral Care AI - Clinical Report", 20, 20);
  
  doc.setFontSize(14);
  doc.text(`Participant: ${mockChild.participant_code}`, 20, 40);
  doc.text(`Age: ${mockChild.age}`, 20, 50);
  doc.text(`Communication Level: ${mockChild.communication_level}`, 20, 60);
  doc.text(`Sensory Profile: ${JSON.stringify(mockChild.sensory_profile)}`, 20, 70);
  
  doc.setFontSize(18);
  doc.text("Latest AI Assessment", 20, 90);
  
  const latest = mockAssessments[mockAssessments.length - 1];
  doc.setFontSize(12);
  doc.text(`Oral Hygiene Score: ${latest.oral_hygiene_score}%`, 20, 100);
  doc.text(`Dietary Risk Score: ${latest.dietary_risk_score}%`, 20, 110);
  doc.text(`Sensory Difficulty Score: ${latest.sensory_difficulty_score}%`, 20, 120);
  doc.text(`Independence Score: ${latest.independence_score}%`, 20, 130);
  
  doc.setFontSize(14);
  doc.text("Current Priorities:", 20, 150);
  
  latest.priorities.forEach((p, i) => {
    doc.text(`- ${p}`, 25, 160 + (i * 10));
  });

  doc.save(`${mockChild.participant_code}_clinical_report.pdf`);
};

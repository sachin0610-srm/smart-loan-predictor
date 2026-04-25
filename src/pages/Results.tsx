import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Download, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import { toast } from "sonner";

interface PredictionResult {
  approved: boolean;
  approvalPercentage: number;
  reasoning: string;
  recommendations?: string[];
}

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [loanAmount, setLoanAmount] = useState("");

  useEffect(() => {
    const resultsStr = localStorage.getItem("predictionResults");
    const personalDetailsStr = localStorage.getItem("personalDetails");
    const loanDetailsStr = localStorage.getItem("loanDetails");

    if (!resultsStr || !personalDetailsStr || !loanDetailsStr) {
      toast.error("Application data not found. Please start over.");
      navigate("/");
      return;
    }

    const resultsData = JSON.parse(resultsStr);
    const personalData = JSON.parse(personalDetailsStr);
    const loanData = JSON.parse(loanDetailsStr);

    setResults(resultsData);
    setApplicantName(personalData.fullName);
    setLoanAmount(loanData.loanAmount);
  }, [navigate]);

  const generatePDF = () => {
    if (!results) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(33, 117, 215);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("National Finance Bank", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Loan Application Decision", pageWidth / 2, 30, { align: "center" });

    // Application Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("Application Details", 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Applicant Name: ${applicantName}`, 20, 75);
    doc.text(`Loan Amount Requested: ₹${Number(loanAmount).toLocaleString("en-IN")}`, 20, 85);
    doc.text(`Application Date: ${new Date().toLocaleDateString("en-IN")}`, 20, 95);
    doc.text(`Reference ID: ${Date.now().toString(36).toUpperCase()}`, 20, 105);

    // Decision
    doc.setFontSize(16);
    doc.text("Loan Decision", 20, 130);
    
    if (results.approved) {
      doc.setTextColor(34, 139, 34);
      doc.setFontSize(20);
      doc.text("✓ APPROVED", 20, 145);
    } else {
      doc.setTextColor(220, 53, 69);
      doc.setFontSize(20);
      doc.text("✗ NOT APPROVED", 20, 145);
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Approval Rating: ${results.approvalPercentage}%`, 20, 160);

    // Reasoning
    doc.setFontSize(16);
    doc.text("Decision Reasoning", 20, 180);
    doc.setFontSize(11);
    const reasoningLines = doc.splitTextToSize(results.reasoning, pageWidth - 40);
    doc.text(reasoningLines, 20, 195);

    // Recommendations
    if (results.recommendations && results.recommendations.length > 0) {
      doc.addPage();
      doc.setFontSize(16);
      doc.text("Recommendations", 20, 30);
      doc.setFontSize(11);
      let yPos = 45;
      results.recommendations.forEach((rec, index) => {
        const recLines = doc.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 40);
        doc.text(recLines, 20, yPos);
        yPos += recLines.length * 7;
      });
    }

    // Footer
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `This is an AI-generated assessment. Final decision subject to verification.`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: "center" }
      );
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    doc.save(`Loan_Application_${applicantName.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
    toast.success("Certificate downloaded successfully!");
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const gaugeData = [
    { value: results.approvalPercentage },
    { value: 100 - results.approvalPercentage },
  ];

  const COLORS = results.approved ? ["#22c55e", "#e5e7eb"] : ["#ef4444", "#e5e7eb"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent">
      <header className="bg-card shadow-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">National Finance Bank</h1>
              <p className="text-sm text-muted-foreground">Trusted Banking Since 1995</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Application Results</h2>
          <p className="text-muted-foreground">AI-Powered Loan Approval Assessment</p>
        </div>

        {/* Status Card */}
        <Card className={`shadow-lg border-2 mb-6 ${results.approved ? "border-success" : "border-destructive"}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              {results.approved ? (
                <CheckCircle className="h-20 w-20 text-success" />
              ) : (
                <XCircle className="h-20 w-20 text-destructive" />
              )}
              <div className="text-center">
                <h3 className={`text-3xl font-bold mb-2 ${results.approved ? "text-success" : "text-destructive"}`}>
                  {results.approved ? "Loan Approved!" : "Loan Not Approved"}
                </h3>
                <p className="text-muted-foreground">
                  Application Reference: {Date.now().toString(36).toUpperCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Percentage Gauge */}
        <Card className="shadow-lg border-2 mb-6">
          <CardHeader>
            <CardTitle>Eligibility Score</CardTitle>
            <CardDescription>AI-calculated approval rating based on your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="100%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {gaugeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-end justify-center pb-2">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${results.approved ? "text-success" : "text-destructive"}`}>
                      {results.approvalPercentage}%
                    </div>
                    <div className="text-sm text-muted-foreground">Eligibility</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reasoning Card */}
        <Card className="shadow-lg border-2 mb-6">
          <CardHeader>
            <CardTitle>Assessment Details</CardTitle>
            <CardDescription>AI analysis of your loan application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-foreground whitespace-pre-line">{results.reasoning}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations Card */}
        {results.recommendations && results.recommendations.length > 0 && (
          <Card className="shadow-lg border-2 mb-6 border-warning">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                <CardTitle>Recommendations</CardTitle>
              </div>
              <CardDescription>Steps to improve your eligibility</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warning text-warning-foreground flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-foreground pt-0.5">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={generatePDF} className="min-w-[200px]">
            <Download className="mr-2 h-5 w-5" />
            Download Certificate
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="min-w-[200px]"
          >
            New Application
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="mt-6 bg-muted border-2">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Important:</strong> This is an AI-powered preliminary assessment. The final loan approval 
              is subject to document verification, credit checks, and bank policy compliance. Our loan officer 
              will contact you within 2-3 business days for further processing.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
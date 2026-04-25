import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing loan application...");

    // Construct comprehensive prompt for AI analysis
    const prompt = `You are an expert loan approval analyst for a professional Indian bank. Analyze the following loan application and provide a detailed assessment.

APPLICATION DATA:
Personal Details:
- Name: ${applicationData.fullName}
- Age: ${calculateAge(applicationData.dateOfBirth)} years
- Gender: ${applicationData.gender}
- Marital Status: ${applicationData.maritalStatus}
- Employment Type: ${applicationData.employmentType}
- Monthly Income: ₹${Number(applicationData.monthlyIncome).toLocaleString("en-IN")}
- Company: ${applicationData.companyName}

Loan Details:
- Loan Type: ${applicationData.loanType}
- Requested Amount: ₹${Number(applicationData.loanAmount).toLocaleString("en-IN")}
- Tenure: ${applicationData.loanTenure} months
- Purpose: ${applicationData.loanPurpose}
- Credit Score: ${applicationData.creditScore}
- Existing Loans: ${applicationData.existingLoans}
${applicationData.existingLoanAmount ? `- Existing Loan Amount: ₹${Number(applicationData.existingLoanAmount).toLocaleString("en-IN")}` : ""}

Financial Ratios:
- Loan to Income Ratio: ${(Number(applicationData.loanAmount) / (Number(applicationData.monthlyIncome) * 12) * 100).toFixed(2)}%
- Monthly EMI (approx): ₹${calculateEMI(Number(applicationData.loanAmount), Number(applicationData.loanTenure))}

ANALYSIS REQUIREMENTS:
1. Calculate an approval percentage (0-100%) based on:
   - Credit score assessment
   - Debt-to-income ratio
   - Employment stability
   - Loan amount vs income
   - Existing financial obligations
   - Purpose of loan
   - Loan type risk assessment

2. Provide a clear decision: APPROVED or NOT APPROVED
   - Approve if percentage >= 65%
   - Not approve if percentage < 65%

3. Provide detailed reasoning covering:
   - Key factors influencing the decision
   - Risk assessment
   - Financial stability analysis
   - Compliance with lending norms

4. If not fully approved or borderline, provide 3-5 specific, actionable recommendations to improve eligibility.

Respond in JSON format:
{
  "approved": boolean,
  "approvalPercentage": number,
  "reasoning": "detailed explanation",
  "recommendations": ["recommendation1", "recommendation2", ...]
}

Keep reasoning professional, clear, and specific to Indian banking standards.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert loan approval analyst. Provide detailed, professional assessments following Indian banking regulations and best practices.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway Error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI Response received");

    let result;
    try {
      const content = aiResponse.choices[0].message.content;
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      result = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback response
      result = {
        approved: false,
        approvalPercentage: 50,
        reasoning: "Unable to complete automated assessment. Please contact our loan officer for manual review.",
        recommendations: [
          "Contact our customer service for manual application review",
          "Ensure all documents are complete and accurate",
          "Consider reapplying with updated financial information",
        ],
      };
    }

    console.log("Loan prediction completed:", result.approved ? "APPROVED" : "NOT APPROVED");

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in predict-loan-approval:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function calculateEMI(principal: number, tenureMonths: number): string {
  const annualRate = 10.5; // Assuming 10.5% annual interest rate
  const monthlyRate = annualRate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return emi.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const loanDetailsSchema = z.object({
  loanType: z.string().min(1, "Loan type is required"),
  loanAmount: z.string().min(1, "Loan amount is required"),
  loanTenure: z.string().min(1, "Loan tenure is required"),
  loanPurpose: z.string().min(10, "Please describe the loan purpose"),
  existingLoans: z.string().min(1, "Please select an option"),
  existingLoanAmount: z.string().optional(),
  creditScore: z.string().min(1, "Credit score range is required"),
  propertyValue: z.string().optional(),
  collateralType: z.string().optional(),
});

type LoanDetailsForm = z.infer<typeof loanDetailsSchema>;

const LoanDetails = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoanDetailsForm>({
    resolver: zodResolver(loanDetailsSchema),
  });

  const existingLoans = watch("existingLoans");
  const loanType = watch("loanType");

  const onSubmit = async (data: LoanDetailsForm) => {
    setIsLoading(true);
    
    try {
      const personalDetailsStr = localStorage.getItem("personalDetails");
      if (!personalDetailsStr) {
        toast.error("Personal details not found. Please start from step 1.");
        navigate("/");
        return;
      }

      const personalDetails = JSON.parse(personalDetailsStr);
      const combinedData = { ...personalDetails, ...data };

      // Call AI prediction edge function
      const { data: predictionData, error } = await supabase.functions.invoke("predict-loan-approval", {
        body: { applicationData: combinedData },
      });

      if (error) {
        console.error("Prediction error:", error);
        toast.error("Failed to process application. Please try again.");
        setIsLoading(false);
        return;
      }

      // Store results and navigate
      localStorage.setItem("loanDetails", JSON.stringify(data));
      localStorage.setItem("predictionResults", JSON.stringify(predictionData));
      
      toast.success("Application processed successfully!");
      navigate("/results");
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Loan Application</h2>
          <p className="text-muted-foreground">Step 2 of 2: Loan Requirements</p>
          <div className="mt-4 flex gap-2">
            <div className="h-2 w-1/2 bg-primary rounded-full"></div>
            <div className="h-2 w-1/2 bg-primary rounded-full"></div>
          </div>
        </div>

        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Loan Details</CardTitle>
            <CardDescription>
              Provide details about your loan requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Loan Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Loan Requirements</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanType">Loan Type *</Label>
                    <Select onValueChange={(value) => setValue("loanType", value)}>
                      <SelectTrigger className={errors.loanType ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="home">Home Loan</SelectItem>
                        <SelectItem value="business">Business Loan</SelectItem>
                        <SelectItem value="education">Education Loan</SelectItem>
                        <SelectItem value="vehicle">Vehicle Loan</SelectItem>
                        <SelectItem value="gold">Gold Loan</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.loanType && (
                      <p className="text-sm text-destructive">{errors.loanType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan Amount (₹) *</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="Enter required amount"
                      {...register("loanAmount")}
                      className={errors.loanAmount ? "border-destructive" : ""}
                    />
                    {errors.loanAmount && (
                      <p className="text-sm text-destructive">{errors.loanAmount.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanTenure">Loan Tenure (Months) *</Label>
                  <Select onValueChange={(value) => setValue("loanTenure", value)}>
                    <SelectTrigger className={errors.loanTenure ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select tenure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 Months (1 Year)</SelectItem>
                      <SelectItem value="24">24 Months (2 Years)</SelectItem>
                      <SelectItem value="36">36 Months (3 Years)</SelectItem>
                      <SelectItem value="48">48 Months (4 Years)</SelectItem>
                      <SelectItem value="60">60 Months (5 Years)</SelectItem>
                      <SelectItem value="120">120 Months (10 Years)</SelectItem>
                      <SelectItem value="180">180 Months (15 Years)</SelectItem>
                      <SelectItem value="240">240 Months (20 Years)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.loanTenure && (
                    <p className="text-sm text-destructive">{errors.loanTenure.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanPurpose">Purpose of Loan *</Label>
                  <Input
                    id="loanPurpose"
                    placeholder="Describe the purpose in detail"
                    {...register("loanPurpose")}
                    className={errors.loanPurpose ? "border-destructive" : ""}
                  />
                  {errors.loanPurpose && (
                    <p className="text-sm text-destructive">{errors.loanPurpose.message}</p>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Financial Status</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="creditScore">Credit Score Range *</Label>
                  <Select onValueChange={(value) => setValue("creditScore", value)}>
                    <SelectTrigger className={errors.creditScore ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (750+)</SelectItem>
                      <SelectItem value="good">Good (700-749)</SelectItem>
                      <SelectItem value="fair">Fair (650-699)</SelectItem>
                      <SelectItem value="poor">Poor (Below 650)</SelectItem>
                      <SelectItem value="unknown">Don't Know</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.creditScore && (
                    <p className="text-sm text-destructive">{errors.creditScore.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="existingLoans">Do you have existing loans? *</Label>
                  <Select onValueChange={(value) => setValue("existingLoans", value)}>
                    <SelectTrigger className={errors.existingLoans ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.existingLoans && (
                    <p className="text-sm text-destructive">{errors.existingLoans.message}</p>
                  )}
                </div>

                {existingLoans === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="existingLoanAmount">Total Existing Loan Amount (₹)</Label>
                    <Input
                      id="existingLoanAmount"
                      type="number"
                      placeholder="Enter total outstanding amount"
                      {...register("existingLoanAmount")}
                    />
                  </div>
                )}
              </div>

              {/* Collateral Information (if applicable) */}
              {(loanType === "home" || loanType === "vehicle" || loanType === "gold") && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Collateral Details</h3>
                  
                  {loanType === "home" && (
                    <div className="space-y-2">
                      <Label htmlFor="propertyValue">Property Value (₹)</Label>
                      <Input
                        id="propertyValue"
                        type="number"
                        placeholder="Estimated property value"
                        {...register("propertyValue")}
                      />
                    </div>
                  )}

                  {loanType === "vehicle" && (
                    <div className="space-y-2">
                      <Label htmlFor="collateralType">Vehicle Type</Label>
                      <Select onValueChange={(value) => setValue("collateralType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="bike">Motorcycle</SelectItem>
                          <SelectItem value="commercial">Commercial Vehicle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {loanType === "gold" && (
                    <div className="space-y-2">
                      <Label htmlFor="propertyValue">Gold Value (₹)</Label>
                      <Input
                        id="propertyValue"
                        type="number"
                        placeholder="Estimated gold value"
                        {...register("propertyValue")}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/")}
                  className="min-w-[150px]"
                >
                  <ChevronLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="min-w-[200px]"
                >
                  {isLoading ? "Processing..." : "Submit Application"}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LoanDetails;
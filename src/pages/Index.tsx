import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield, TrendingUp, FileText, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-accent">
      {/* Header */}
      <header className="bg-card shadow-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">National Finance Bank</h1>
              <p className="text-sm text-muted-foreground">Trusted Banking Since 1995</p>
            </div>
          </div>
          <Button onClick={() => navigate("/")}>Apply Now</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
            AI-Powered Loan Approval
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get instant loan eligibility assessment powered by advanced artificial intelligence. 
            Fast, transparent, and secure loan processing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/")} className="text-lg px-8 py-6">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-foreground mb-12">
          Why Choose Our Loan Service?
        </h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Advanced machine learning algorithms analyze your application for accurate approval predictions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Secure & Compliant</CardTitle>
              <CardDescription>
                Bank-grade security and full compliance with Indian financial regulations and data protection laws
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Instant Certificate</CardTitle>
              <CardDescription>
                Download your loan approval certificate immediately with detailed eligibility assessment
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12">
            Simple 3-Step Process
          </h3>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Enter Personal Details</h4>
                <p className="text-muted-foreground">
                  Provide your personal information, identity documents, and employment details
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Submit Loan Requirements</h4>
                <p className="text-muted-foreground">
                  Specify your loan type, amount, tenure, and purpose along with financial information
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">Get Instant AI Assessment</h4>
                <p className="text-muted-foreground">
                  Receive your eligibility score, approval decision, and downloadable certificate instantly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-foreground mb-12">
          Available Loan Products
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { name: "Personal Loan", rate: "10.5% p.a.", amount: "Up to ₹25 Lakhs" },
            { name: "Home Loan", rate: "8.5% p.a.", amount: "Up to ₹5 Crores" },
            { name: "Business Loan", rate: "11% p.a.", amount: "Up to ₹50 Lakhs" },
            { name: "Education Loan", rate: "9% p.a.", amount: "Up to ₹30 Lakhs" },
            { name: "Vehicle Loan", rate: "9.5% p.a.", amount: "Up to ₹15 Lakhs" },
            { name: "Gold Loan", rate: "7.5% p.a.", amount: "Up to ₹1 Crore" },
          ].map((loan) => (
            <Card key={loan.name} className="border-2">
              <CardHeader>
                <CardTitle className="text-lg">{loan.name}</CardTitle>
                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">Starting from {loan.rate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">{loan.amount}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Get Your Loan Approved?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have received instant loan approvals through our AI system
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/")} className="text-lg px-8 py-6">
            Apply Now - It's Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 National Finance Bank. All rights reserved.</p>
          <p className="text-sm mt-2">
            Licensed by Reserve Bank of India | Regulated Banking Entity
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CredBuzzLogo from "./CredBuzzLogo";

const CTA = () => {
  return (
    <section className="py-12 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-ai-darkOrange/20 to-white"></div>
      
      {/* Glowing circle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-ai-orange/10 rounded-full filter blur-3xl opacity-30"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <CredBuzzLogo size="md" />
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
            Join the CredBuzz Network <span className="text-gradient">Today</span>
          </h2>
          
          <p className="text-base text-ai-dark/80 mb-6">
            Join thousands of brands and influencers already transforming their collaborations with our platform.
            Try it risk-free with our 14-day trial.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-ai-orange hover:bg-ai-darkOrange text-white px-6 py-2">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="border-ai-orange text-ai-dark hover:bg-ai-orange/10 px-6 py-2">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;

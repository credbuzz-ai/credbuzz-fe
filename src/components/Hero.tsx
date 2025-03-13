
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import CredBuzzLogo from "./CredBuzzLogo";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background abstract shapes */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-ai-orange/30 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ai-darkOrange/30 rounded-full filter blur-3xl opacity-20 animate-pulse-slow delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6">
            <CredBuzzLogo size="lg" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            <span className="text-gradient">Ultimate</span> Web3
            <br /> KOL Marketplace
          </h1>
          
          <p className="text-lg text-ai-dark/80 max-w-2xl mb-8">
            Simplifying Partnerships & Boosting Monetization
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/app">
              <Button className="bg-ai-orange hover:bg-ai-darkOrange text-white px-6 py-2">
                Go to App
              </Button>
            </Link>
            <Button variant="outline" className="border-ai-orange text-ai-dark hover:bg-ai-orange/10 px-6 py-2">
              See Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

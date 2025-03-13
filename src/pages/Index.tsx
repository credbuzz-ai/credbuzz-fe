
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TheProblem from "@/components/TheProblem";
import Features from "@/components/Features";
import ForBusiness from "@/components/ForBusiness";
import ForKOLs from "@/components/ForKOLs";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white text-ai-dark overflow-x-hidden">
      <Navbar />
      <Hero />
      <TheProblem />
      <Features />
      <ForBusiness />
      <ForKOLs />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;


import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake, ShieldCheck, CreditCard, Search, FileChartColumn, PieChart } from "lucide-react";

const features = [
  {
    icon: <Handshake className="h-5 w-5 text-ai-orange" />,
    title: "Seamless Outreach",
    description: "Connect directly with influencers, no middleman required."
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-ai-orange" />,
    title: "Secure Bidding System",
    description: "Attract top KOLs with transparent bids."
  },
  {
    icon: <PieChart className="h-5 w-5 text-ai-orange" />,
    title: "Quality Assurance",
    description: "Payments released only after engagement metrics are verified."
  },
  {
    icon: <CreditCard className="h-5 w-5 text-ai-orange" />,
    title: "Flexible Payment Options",
    description: "Pay in tokens, stablecoins or traditional currency."
  },
  {
    icon: <Search className="h-5 w-5 text-ai-orange" />,
    title: "Insight-driven Recommendations",
    description: "Get matched with the perfect influencers for your specific needs."
  },
  {
    icon: <FileChartColumn className="h-5 w-5 text-ai-orange" />,
    title: "Performance Analytics",
    description: "Track how your campaign performed and what was the ROI."
  }
];

const ForBusiness = () => {
  return (
    <section id="for-business" className="py-12 bg-white relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-ai-darkOrange/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-ai-orange/30 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">For Business</span>
          </h2>
          <p className="text-lg text-ai-dark/70 max-w-2xl mx-auto">
            Transform your marketing with direct access to key opinion leaders.
            Our platform removes barriers and maximizes ROI.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-6 mb-10">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="flex items-center mb-2 text-ai-dark">
                <div className="mr-2">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
              </div>
              <p className="text-sm text-ai-dark/70 pl-7">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-ai-orange hover:bg-ai-darkOrange text-white px-6 py-2">
            Schedule a Business Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ForBusiness;


import { Search, Handshake, CheckCircle, DollarSign, Lock, BarChart, Package } from "lucide-react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Search className="h-8 w-8 text-white" />,
    title: "Strategic KOL discovery",
    description: "Find the perfect key opinion leaders for your crypto project with our intelligent matching system."
  },
  {
    icon: <Handshake className="h-8 w-8 text-white" />,
    title: "Smart-contract driven partnerships",
    description: "Automate partnership agreements with secure, transparent smart contracts on the blockchain."
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-white" />,
    title: "Automated endorsement verification",
    description: "Verify endorsements and campaign deliverables automatically with our blockchain verification system."
  },
  {
    icon: <DollarSign className="h-8 w-8 text-white" />,
    title: "Performance-based payment models",
    description: "Pay for results with our flexible, performance-driven payment structures and escrow services."
  },
  {
    icon: <Lock className="h-8 w-8 text-white" />,
    title: "Secure, transparent transactions",
    description: "Ensure all transactions are secure, immutable and fully transparent on the blockchain."
  },
  {
    icon: <BarChart className="h-8 w-8 text-white" />,
    title: "Deep campaign analytics",
    description: "Access comprehensive campaign performance metrics and engagement analytics in real-time."
  },
  {
    icon: <Package className="h-8 w-8 text-white" />,
    title: "CRED Protocol",
    description: "Leverage our proprietary protocol for reputation management and KOL verification in the crypto space."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-12 bg-white relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-ai-orange/20 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-ai-darkOrange/20 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Decentralized Marketplace</span>
          </h2>
          <p className="text-lg text-ai-dark/70 max-w-3xl mx-auto">
            Connect crypto projects with key opinion leaders (KOLs) through our innovative platform.
          </p>
        </div>
        
        {/* Infographic Section */}
        <div className="relative mb-10">
          {/* Central Connector Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-ai-orange to-ai-darkOrange transform -translate-x-1/2 hidden md:block"></div>
          
          <div className="space-y-10 md:space-y-0 relative">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } gap-4 md:gap-8 mb-10`}
              >
                {/* Icon Circle */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-r from-ai-orange to-ai-darkOrange flex items-center justify-center shadow-lg z-10 mt-3 flex-shrink-0">
                  {feature.icon}
                </div>
                
                {/* Content */}
                <div className={`md:w-1/2 md:max-w-md glass-card p-4 rounded-xl shadow-lg text-center md:text-left ${
                  index % 2 === 0 ? 'md:text-right md:ml-auto' : 'md:mr-auto'
                }`}>
                  <h3 className="text-lg font-bold mb-2 text-ai-dark">{feature.title}</h3>
                  <p className="text-sm text-ai-dark/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <Button className="bg-ai-orange hover:bg-ai-darkOrange text-white px-6 py-2">
            Explore Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;

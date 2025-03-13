
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, Shield, Wallet, BarChart, Trophy } from "lucide-react";
import KOLApplicationForm from "./KOLApplicationForm";

const ForKOLs = () => {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  
  const benefits = [
    {
      icon: <Trophy className="h-5 w-5 text-ai-orange" />,
      title: "Streamlined Deal Flow",
      description: "Receive and evaluate legitimate partnership offers"
    },
    {
      icon: <Filter className="h-5 w-5 text-ai-orange" />,
      title: "Reduced Inbox Noise",
      description: "Filter out spam and low-quality requests"
    },
    {
      icon: <Shield className="h-5 w-5 text-ai-orange" />,
      title: "Secure Payments",
      description: "Smart contract-driven settlements protect your interests"
    },
    {
      icon: <Wallet className="h-5 w-5 text-ai-orange" />,
      title: "Privacy Protection",
      description: "Keep your payment wallets anonymous and secure"
    },
    {
      icon: <BarChart className="h-5 w-5 text-ai-orange" />,
      title: "Performance Metrics",
      description: "Build your reputation with verified engagement data"
    },
    {
      icon: <Trophy className="h-5 w-5 text-ai-orange" />,
      title: "Improve Visibility",
      description: "Get more visibility through CRED Leaderboard"
    }
  ];

  return (
    <section id="for-kols" className="py-12 bg-white relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-1/3 left-0 w-72 h-72 bg-ai-darkOrange/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-ai-orange/30 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">For Key Opinion Leaders</span>
          </h2>
          <p className="text-lg text-ai-dark/70 max-w-2xl mx-auto">
            Amplify your influence and engage your audience more effectively with AI-powered tools designed for KOLs.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-6 mb-10">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="flex items-center mb-2 text-ai-dark">
                <div className="mr-2">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-semibold">{benefit.title}</h3>
              </div>
              <p className="text-sm text-ai-dark/70 pl-7">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <h3 className="text-xl font-bold mb-4 text-ai-dark">Join Our KOL Network</h3>
          <p className="text-ai-dark/70 max-w-2xl mx-auto mb-6 text-sm">
            Connect with other influencers and gain exclusive access to our premium AI tools designed specifically for key opinion leaders.
          </p>
          <Button 
            className="bg-ai-orange hover:bg-ai-darkOrange text-white px-6 py-2"
            onClick={() => setIsApplicationOpen(true)}
          >
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <KOLApplicationForm 
        open={isApplicationOpen} 
        onOpenChange={setIsApplicationOpen} 
      />
    </section>
  );
};

export default ForKOLs;

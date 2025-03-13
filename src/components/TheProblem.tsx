
import { Search, Handshake, BarChart3 } from "lucide-react";

const TheProblem = () => {
  return (
    <section id="the-problem" className="py-12 bg-white relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-ai-orange/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-ai-darkOrange/10 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">What We're Solving</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Discovery Gap */}
          <div className="rounded-xl p-6 transition-all duration-300 bg-gradient-to-br from-orange-300 to-orange-400 text-white h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-white">Discovery Gap</h3>
            
            <div className="space-y-4 flex-grow">
              <p className="text-white/90 text-base">
                Projects struggle to find and connect with the right crypto influencers
              </p>
              
              <p className="text-white/90 text-base">
                No reliable system to verify influencer credibility or audience authenticity
              </p>
            </div>
          </div>
          
          {/* Card 2: Partnership Friction */}
          <div className="rounded-xl p-6 transition-all duration-300 bg-gradient-to-br from-orange-400 to-orange-500 text-white h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-white">Partnership Friction</h3>
            
            <div className="space-y-4 flex-grow">
              <p className="text-white/90 text-base">
                Influencers overwhelmed with unfiltered partnership requests
              </p>
              
              <p className="text-white/90 text-base">
                Lack of security, transparency, and accountability in transactions
              </p>
            </div>
          </div>
          
          {/* Card 3: Value Leakage */}
          <div className="rounded-xl p-6 transition-all duration-300 bg-gradient-to-br from-orange-500 to-red-500 text-white h-full flex flex-col">
            <h3 className="text-xl font-bold mb-4 text-white">Value Leakage</h3>
            
            <div className="space-y-4 flex-grow">
              <p className="text-white/90 text-base">
                ROI measurement is difficult and inconsistent
              </p>
              
              <p className="text-white/90 text-base">
                Middlemen increase costs and friction across the $16+ billion market
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;

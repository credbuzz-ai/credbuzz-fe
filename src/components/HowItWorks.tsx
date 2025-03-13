
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Zap, MessageCircle, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <Layers className="h-8 w-8 text-ai-orange" />,
    title: "Sign Up & Connect",
    description: "Create your account and connect to our AI platform in just a few clicks. No technical setup required."
  },
  {
    number: "02",
    icon: <MessageCircle className="h-8 w-8 text-ai-orange" />,
    title: "Start Your Conversation",
    description: "Begin interacting with our advanced AI using natural language. Ask questions or give instructions."
  },
  {
    number: "03",
    icon: <Zap className="h-8 w-8 text-ai-orange" />,
    title: "Receive AI Responses",
    description: "Get instant, intelligent responses powered by our cutting-edge AI models, tailored to your needs."
  },
  {
    number: "04",
    icon: <CheckCircle className="h-8 w-8 text-ai-orange" />,
    title: "Implement & Iterate",
    description: "Use the AI's outputs in your workflow and refine your prompts for better results over time."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-white/95"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">How It Works</span>
          </h2>
          <p className="text-xl text-ai-dark/70 max-w-2xl mx-auto">
            Getting started with our AI platform is quick and seamless. Follow these simple steps:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="glass-card rounded-xl p-8 border-l-4 border-l-ai-orange transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            >
              <div className="flex items-start space-x-4">
                <span className="text-3xl font-bold text-ai-orange/30">{step.number}</span>
                <div>
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-ai-dark">{step.title}</h3>
                  <p className="text-ai-dark/70">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button className="bg-ai-orange hover:bg-ai-darkOrange text-white px-8 py-6 text-lg">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingToggle = ({ annual, setAnnual }: { annual: boolean; setAnnual: (value: boolean) => void }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-10">
      <span className={`text-lg ${!annual ? "text-ai-light" : "text-ai-light/60"}`}>Monthly</span>
      <div
        className="w-16 h-8 bg-ai-dark rounded-full p-1 cursor-pointer relative"
        onClick={() => setAnnual(!annual)}
      >
        <div
          className={`w-6 h-6 rounded-full bg-ai-orange absolute transform transition-transform duration-300 ${
            annual ? "translate-x-8" : "translate-x-0"
          }`}
        ></div>
      </div>
      <span className={`text-lg ${annual ? "text-ai-light" : "text-ai-light/60"}`}>
        Annual <span className="text-ai-orange text-sm">Save 20%</span>
      </span>
    </div>
  );
};

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Basic",
      price: annual ? "$19" : "$24",
      period: annual ? "/year" : "/month",
      description: "Perfect for individuals and small projects.",
      features: [
        "1,000 AI requests per month",
        "Standard response time",
        "3 AI models",
        "Basic analytics",
        "Email support"
      ],
      popular: false,
      buttonText: "Get Started"
    },
    {
      name: "Pro",
      price: annual ? "$49" : "$59",
      period: annual ? "/year" : "/month",
      description: "Ideal for professionals and growing teams.",
      features: [
        "10,000 AI requests per month",
        "Priority response time",
        "All AI models",
        "Advanced analytics",
        "Priority support",
        "Custom training (limited)"
      ],
      popular: true,
      buttonText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For organizations with advanced needs.",
      features: [
        "Unlimited AI requests",
        "Fastest response time",
        "All models + early access",
        "Comprehensive analytics",
        "Dedicated support",
        "Custom training",
        "Enterprise SLA",
        "On-premises option"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-ai-dark relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-ai-darkOrange/30 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-ai-orange/30 rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Flexible Pricing</span>
          </h2>
          <p className="text-xl text-ai-light/70 max-w-2xl mx-auto mb-8">
            Choose the plan that works best for your needs. All plans come with a 14-day free trial.
          </p>
          
          <PricingToggle annual={annual} setAnnual={setAnnual} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`glass-card rounded-xl p-8 transition-all duration-300 relative ${
                plan.popular ? "border border-ai-orange shadow-[0_0_30px_rgba(249,115,22,0.25)] transform scale-105 md:-translate-y-2" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-ai-orange text-white text-sm font-medium py-1 px-4 rounded-full">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2 text-ai-light">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-ai-light">{plan.price}</span>
                <span className="text-ai-light/60">{plan.period}</span>
              </div>
              <p className="text-ai-light/70 mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-ai-orange shrink-0 mr-2" />
                    <span className="text-ai-light/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.popular
                    ? "bg-ai-orange hover:bg-ai-darkOrange text-white"
                    : "bg-transparent border border-ai-orange text-ai-light hover:bg-ai-orange/10"
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

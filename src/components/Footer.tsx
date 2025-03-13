
import { GithubIcon, TwitterIcon, LinkedinIcon, InstagramIcon } from "lucide-react";
import CredBuzzLogo from "./CredBuzzLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white/95 border-t border-ai-orange/10 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <a href="/" className="inline-block mb-4">
              <CredBuzzLogo size="sm" />
            </a>
            <p className="text-ai-dark/70 font-medium mb-4">
              Connect brands with influencers. Simplifying partnerships and boosting monetization.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/CredBuzzAI" className="text-ai-dark/50 hover:text-ai-orange transition">
                <TwitterIcon className="h-5 w-5" />
              </a>
              {/* <a href="#" className="text-ai-dark/50 hover:text-ai-orange transition">
                <LinkedinIcon className="h-5 w-5" />
              </a> */}
              <a href="https://github.com/credbuzz-ai" className="text-ai-dark/50 hover:text-ai-orange transition">
                <GithubIcon className="h-5 w-5" />
              </a>
              {/* <a href="#" className="text-ai-dark/50 hover:text-ai-orange transition">
                <InstagramIcon className="h-5 w-5" />
              </a> */}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-ai-dark mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Features</a></li>
              <li><a href="#pricing" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Pricing</a></li>
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">API</a></li>
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-ai-dark mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Documentation</a></li>
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Guides</a></li>
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Blog</a></li>
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-ai-dark mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">About Us</a></li>
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Careers</a></li>
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Privacy Policy</a></li>
              <li><a href="#" className="text-ai-dark/70 font-medium hover:text-ai-orange transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-ai-orange/10 pt-8 text-center md:text-left md:flex items-center justify-between">
          <p className="text-ai-dark/60 font-medium">
            &copy; {currentYear} CredBuzz. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="text-ai-dark/60 font-medium hover:text-ai-orange transition mr-6">
              Privacy Policy
            </a>
            <a href="#" className="text-ai-dark/60 font-medium hover:text-ai-orange transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

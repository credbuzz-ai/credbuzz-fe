
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import CredBuzzLogo from "./CredBuzzLogo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md py-2 shadow-lg" : "bg-transparent py-3"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center space-x-2">
            <CredBuzzLogo />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-ai-dark/80 hover:text-ai-orange transition">
              Features
            </a>
            <a href="#for-business" className="text-ai-dark/80 hover:text-ai-orange transition">
              For Business
            </a>
            <a href="#for-kols" className="text-ai-dark/80 hover:text-ai-orange transition">
              For KOLs
            </a>
            <Button className="bg-ai-orange hover:bg-ai-darkOrange text-white px-4 py-1 text-sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-ai-dark hover:text-ai-orange"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mt-3 pb-3 md:hidden flex flex-col space-y-3">
            <a
              href="#features"
              className="text-ai-dark/80 hover:text-ai-orange transition px-2 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#for-business"
              className="text-ai-dark/80 hover:text-ai-orange transition px-2 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              For Business
            </a>
            <a
              href="#for-kols"
              className="text-ai-dark/80 hover:text-ai-orange transition px-2 py-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              For KOLs
            </a>
            <Button 
              className="bg-ai-orange hover:bg-ai-darkOrange text-white w-full mt-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

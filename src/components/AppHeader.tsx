
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Twitter } from "lucide-react";

interface AppHeaderProps {
  title?: string;
}

const AppHeader = ({ title }: AppHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, disconnectWallet, twitterConnected, twitterHandle } = useAuth();

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected",
    });
    navigate("/app");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold text-ai-orange">{title || "CredBuzz"}</h1>
        
        <div className="flex items-center gap-3">
          {twitterConnected && (
            <div className="hidden md:flex items-center text-sm bg-blue-50 text-[#1DA1F2] px-3 py-1 rounded-full">
              <Twitter className="w-4 h-4 mr-1" />
              <span>{twitterHandle || "@twitteruser123"}</span>
            </div>
          )}
          
          {isAuthenticated && (
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={handleDisconnect}
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Disconnect</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

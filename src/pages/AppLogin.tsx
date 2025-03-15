import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { useContract } from "@/hooks/useContract";
import KOLApplicationForm from "@/components/KOLApplicationForm";

const AppLogin = () => {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth } = useAuth();
  const { register } = useContract();

  useEffect(() => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      });
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    };

    checkConnection();
  }, [toast, connectedAccount]);

  const createUser = async (userType: string) => {
    try {
      if (userType === "kol") {
        setIsApplicationOpen(true);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_TEST_API_KEY,
            source: import.meta.env.VITE_SOURCE,
          },
          body: JSON.stringify({
            user_type: userType,
            wallet_addr: connectedAccount,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      register();

      navigateToDashboard(userType);
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error creating user",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleConnect = async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask not installed",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      });
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setConnectedAccount(accounts[0]);
        toast({
          title: "Connected successfully!",
          description: "Please continue to the business dashboard.",
        });
      }
    } catch (error: unknown) {
      console.error("Error connecting to MetaMask:", error);
      toast({
        title: "Connection error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const fetchUserDetails = async (userType: string) => {
    try {
      if (!connectedAccount) {
        toast({
          title: "No wallet connected",
          description: "Please connect your wallet to continue",
          variant: "destructive",
        });
        return; // Stop execution if no wallet is connected
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/get-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_TEST_API_KEY,
            source: import.meta.env.VITE_SOURCE,
          },
          body: JSON.stringify({
            user_type: userType,
            wallet_addr: connectedAccount,
          }),
        }
      );

      if (response.status === 200) {
        navigateToDashboard(userType);
      } else if (response.status === 404) {
        createUser(userType); // Handle user not found
      } else {
        toast({
          title: "Unexpected response",
          description: `Server returned status: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast({
        title: "Error fetching user details",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const navigateToDashboard = (userType: string) => {
    setAuth(true);
    navigate(`/${userType}-dashboard`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader title="CredBuzz Login" />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-ai-orange">
              Connect to CredBuzz
            </h1>
            <p className="mt-2 text-gray-600">
              Connect your wallet to access the CredBuzz platform as a business
            </p>
          </div>

          {!connectedAccount ? (
            <div className="mt-8">
              <Button
                className="w-full bg-ai-orange hover:bg-ai-darkOrange"
                onClick={handleConnect}
                disabled={typeof window.ethereum === "undefined"}
              >
                {typeof window.ethereum === "undefined"
                  ? "MetaMask Required"
                  : "Connect Wallet"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-200">
                <p className="text-sm text-gray-700">Connected with</p>
                <p className="font-mono font-medium">
                  {connectedAccount.substring(0, 6)}...
                  {connectedAccount.substring(connectedAccount.length - 4)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-3">
                  <p className="text-center text-sm text-gray-600">
                    Select your role to continue:
                  </p>
                  <Button
                    className="w-full bg-ai-orange hover:bg-ai-darkOrange"
                    onClick={() => fetchUserDetails("business")}
                  >
                    I'm a Business
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => fetchUserDetails("kol")}
                  >
                    I'm a KOL
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-50 border-t py-4">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} CredBuzz. All rights reserved.
          </p>
        </div>
      </footer>
      <KOLApplicationForm
        open={isApplicationOpen}
        onOpenChange={setIsApplicationOpen}
      />
    </div>
  );
};

export default AppLogin;

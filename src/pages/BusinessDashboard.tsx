import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateCampaignForm } from "@/components/CreateCampaignForm";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/lib/types";

const BusinessDashboard = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [userId, setUserId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            toast({
              title: "Not connected",
              description: "Please connect your wallet first",
              variant: "destructive",
            });
            navigate("/app");
          }
        } catch (error) {
          console.error("Error checking connection:", error);
          navigate("/app");
        }
      } else {
        toast({
          title: "MetaMask not installed",
          description: "Please install MetaMask to use this application",
          variant: "destructive",
        });
        navigate("/app");
      }
    };

    checkConnection();
  }, [navigate, toast]);

  const fetchAllCampaigns = async () => {
    if (!userId) return;
    const campaigns = await fetch(
      `${import.meta.env.VITE_BASE_URL}/get-campaigns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_TEST_API_KEY,
          source: import.meta.env.VITE_SOURCE,
        },
        body: JSON.stringify({
          business_user_id: userId,
        }),
      }
    );
    const data = await campaigns.json();
    setCampaigns(data.result);
  };

  const fetchUserDetails = async () => {
    if (!account) return;
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/get-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_TEST_API_KEY,
        source: import.meta.env.VITE_SOURCE,
      },
      body: JSON.stringify({
        user_type: "business",
        wallet_addr: account,
      }),
    });
    const userData = await response.json();
    setUserId(userData.result.user_id);
  };

  useEffect(() => {
    fetchUserDetails();
  }, [account]);

  useEffect(() => {
    if (userId) {
      fetchAllCampaigns();
    }
  }, [userId]);

  const handleCampaignCreated = (newCampaign: Campaign) => {
    if (selectedCampaign) {
      setCampaigns(
        campaigns.map((camp) =>
          camp.campaign_id === selectedCampaign.campaign_id
            ? { ...newCampaign, campaign_id: selectedCampaign.campaign_id }
            : camp
        )
      );
      toast({
        title: "Campaign Updated",
        description: `Campaign "${newCampaign.project_name}" has been updated successfully`,
      });
    } else {
      fetchAllCampaigns();
      toast({
        title: "Campaign Created",
        description: `Campaign "${newCampaign.project_name}" has been created successfully`,
      });
    }
    setIsDialogOpen(false);
    setSelectedCampaign(null);
  };

  const handleOpenCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCampaign(null);
  };

  if (!account) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader title="Business Dashboard" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <div className="text-sm bg-gray-100 px-3 py-1 rounded-full mr-3">
            {account?.substring(0, 6)}...
            {account?.substring(account?.length - 4)}
          </div>
          <Button
            className="bg-ai-orange hover:bg-ai-darkOrange"
            onClick={() => {
              setSelectedCampaign(null);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Campaigns</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((campaign, index) => {
                const offerEndTime = new Date(
                  campaign.offer_end_date
                ).getTime();
                const promotionEndTime = new Date(
                  campaign.promotion_end_date
                ).getTime();

                const offerTimeLeft = Math.max(offerEndTime - currentTime, 0);
                const promotionTimeLeft = Math.max(
                  promotionEndTime - currentTime,
                  0
                );
                const formatTimeLeft = (timeLeft: number) => {
                  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                  const hours = Math.floor(
                    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                  );
                  const minutes = Math.floor(
                    (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
                  );
                  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
                };
                const isExpired =
                  Date.now() >=
                  new Date(campaign.offer_end_date * 1000).getTime();
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white overflow-hidden cursor-pointer"
                    onClick={() => handleOpenCampaign(campaign)}
                  >
                    <div className="mb-2 flex justify-between items-start">
                      <h3 className="font-semibold text-lg mb-1 text-ai-orange">
                        {campaign.project_name}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          {
                            open: "bg-yellow-100 text-yellow-800",
                            accepted: "bg-green-100 text-green-800",
                            discarded: "bg-gray-100 text-gray-800",
                            fulfilled: "bg-blue-100 text-blue-800",
                            unfulfilled: "bg-red-100 text-red-800",
                          }[campaign.status] || "bg-gray-200 text-gray-900"
                        }`}
                      >
                        {{
                          open: "Open",
                          accepted: "Accepted",
                          discarded: "Discarded",
                          fulfilled: "Fulfilled",
                          unfulfilled: "Unfulfilled",
                        }[campaign.status] || "Unknown"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {campaign.description}
                    </p>
                    <div className="text-xs text-gray-500 mb-2">
                      <span className="block mb-1">
                        X: {campaign.x_author_handle}
                      </span>
                      <span className="block mb-1 truncate">
                        Website: {campaign.website}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2 mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Offer ends:</span>
                        {campaign.offer_end_date > currentTime &&
                        campaign.status === "open" ? (
                          <span>{formatTimeLeft(offerTimeLeft)}</span>
                        ) : (
                          <span>
                            {{
                              accepted: "Accepted",
                              fulfilled: "Fulfilled",
                              unfulfilled: "Unfulfilled",
                            }[campaign.status] || "Expired"}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Promotion ends:</span>
                        {campaign.promotion_end_date > currentTime &&
                        campaign.status === "open" ? (
                          <span>{formatTimeLeft(promotionTimeLeft)}</span>
                        ) : (
                          <span>
                            {{
                              accepted: "Accepted",
                              fulfilled: "Fulfilled",
                              unfulfilled: "Unfulfilled",
                            }[campaign.status] || "Expired"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {campaign.kol_wallet_addr
                          ? `Assigned: ${campaign.kol_wallet_addr.substring(
                              0,
                              6
                            )}...${campaign.kol_wallet_addr.substring(
                              campaign.kol_wallet_addr.length - 4
                            )}`
                          : "Unassigned"}
                      </div>
                      <div className="font-semibold text-sm text-ai-orange">
                        {campaign.amount} USDC
                      </div>
                    </div>
                    {isExpired && (
                      <div className="mt-2 text-xs text-red-600 text-center bg-red-50 py-1 rounded">
                        Campaign offer has expired
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500">
                No campaigns found
              </div>
            )}
          </div>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCampaign ? "Edit Campaign" : "Create New Campaign"}
            </DialogTitle>
            <DialogDescription>
              {selectedCampaign
                ? "Update the details of your existing campaign."
                : "Fill in the details below to create a new KOL promotion campaign."}
            </DialogDescription>
          </DialogHeader>
          <CreateCampaignForm
            onCampaignCreated={handleCampaignCreated}
            existingCampaign={selectedCampaign}
            onCancel={handleCloseDialog}
            userId={userId}
            fetchCampaigns={fetchAllCampaigns}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast, useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/lib/types";

const KOLDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, twitterConnected } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userId, setUserId] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const checkConnection = async () => {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setConnectedAccount(accounts[0]);
        }
      };
      checkConnection();
    }
  }, []);

  const fetchUserDetails = async () => {
    if (!connectedAccount) return;
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/get-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_TEST_API_KEY,
        source: import.meta.env.VITE_SOURCE,
      },
      body: JSON.stringify({
        user_type: "kol",
        wallet_addr: connectedAccount,
      }),
    });
    const data = await response.json();
    console.log(data);
    setUserId(data.result.user_id);
  };

  useEffect(() => {
    fetchUserDetails();
  }, [connectedAccount]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Not authenticated",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      navigate("/app");
      return;
    }

    // Redirect if Twitter not connected
    if (!twitterConnected) {
      toast({
        title: "Twitter authentication required",
        description: "Please connect your Twitter account first",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  }, [isAuthenticated, twitterConnected, navigate, toast]);

  const fetchCampaigns = async () => {
    if (!userId) return;
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL}/get-campaigns`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_TEST_API_KEY,
          source: import.meta.env.VITE_SOURCE,
        },
        body: JSON.stringify({
          kol_user_id: userId,
        }),
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      setCampaigns(data.result || []);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [userId]);

  const acceptCampaign = async (campaignId: string) => {
    // Find the campaign to check its end date
    const campaign = campaigns.find(
      (c) => c.campaign_id === parseInt(campaignId)
    );

    if (!campaign) {
      toast({
        title: "Error",
        description: "Campaign not found",
        variant: "destructive",
      });
      return;
    }

    // Check if the offer has expired
    const currentTime = Date.now();
    if (currentTime < new Date(campaign.offer_end_date * 1000).getTime()) {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/update-campaign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_TEST_API_KEY,
            source: import.meta.env.VITE_SOURCE,
          },
          body: JSON.stringify({
            campaign_id: campaignId,
            status: "accepted",
          }),
        }
      );
      if (response.status === 200) {
        fetchCampaigns();
        toast({
          title: "Campaign accepted",
          description: "You have accepted the campaign",
        });
      }
    } else {
      toast({
        title: "Offer expired",
        description: "This campaign's offer period has ended",
        variant: "destructive",
      });
      return;
    }
  };

  // The actual KOL Dashboard layout and components
  return (
    <div className="min-h-screen bg-white">
      <AppHeader title="KOL Dashboard" />

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Your Promotions</h2>
        {campaigns && campaigns?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => {
              const isExpired =
                Date.now() >=
                new Date(campaign.offer_end_date * 1000).getTime();
              return (
                <div
                  key={campaign.campaign_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white overflow-hidden"
                >
                  <div className="mb-2 flex justify-between items-start">
                    <h3 className="font-semibold text-lg mb-1 text-ai-orange">
                      {campaign.project_name}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        campaign.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : isExpired
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {campaign.status === "accepted"
                        ? "Active"
                        : isExpired
                        ? "Expired"
                        : "Pending"}
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
                      <span>
                        {new Date(
                          campaign.offer_end_date * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Promotion ends:</span>
                      <span>
                        {new Date(
                          campaign.promotion_end_date * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end items-center mt-3">
                    <div className="font-semibold text-sm text-ai-orange">
                      {campaign.amount} USDC
                    </div>
                  </div>
                  {campaign.status === "pending" && !isExpired && (
                    <Button
                      onClick={() =>
                        acceptCampaign(campaign.campaign_id.toString())
                      }
                    >
                      Accept
                    </Button>
                  )}
                  {campaign.status === "pending" && isExpired && (
                    <Button disabled className="opacity-50 cursor-not-allowed">
                      Expired
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg border">
            <p className="text-gray-500">No active promotions yet.</p>
            <p className="text-gray-500 mt-2">
              Businesses will reach out to you for promotions soon!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default KOLDashboard;

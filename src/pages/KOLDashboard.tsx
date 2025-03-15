import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Campaign } from "@/lib/types";
import { useContract } from "@/hooks/useContract";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
const KOLDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, twitterConnected } = useAuth();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [userId, setUserId] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const { fulfilProjectCampaign, acceptProjectCampaign } = useContract();
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [tweetLink, setTweetLink] = useState("");
  const [open, setOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [aiTweet, setAiTweet] = useState("");
  const [acceptCampaignId, setAcceptCampaignId] = useState<string | null>(null);
  const [tweetVerificationOpen, setTweetVerificationOpen] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState(false);

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
    if (currentTime < new Date(campaign.offer_end_date).getTime()) {
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
      if (response.status === 200 && campaign.campaign_id) {
        fetchCampaigns();
        await acceptProjectCampaign(campaign.campaign_id);
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

  const claimCampaign = async (campaignId: string, tweetLink: string) => {
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
          status: "fulfilled",
          tweet_link: tweetLink,
        }),
      }
    );

    if (response.status === 200 && campaignId) {
      await fulfilProjectCampaign(Number(campaignId));
      toast({
        title: "Campaign claimed",
        description: "You have claimed the campaign",
      });
      setOpen(false);
      fetchCampaigns();
    }
  };

  const [timeLeft, setTimeLeft] = useState(10); // 2 minutes

  const updateTweetInDB = async () => {
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
          campaign_id: Number(campaignId),
          tweet_url: tweetLink,
        }),
      }
    );
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
    }
  };
  useEffect(() => {
    if (!tweetVerificationOpen) {
      setTimeLeft(10); // Reset timer when dialog is closed
      return;
    }

    if (timeLeft === 10) {
      updateTweetInDB();
    }

    if (timeLeft === 0) return;

    const timer = setInterval(async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/verify-tweet`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": import.meta.env.VITE_TEST_API_KEY,
              source: import.meta.env.VITE_SOURCE,
            },
            body: JSON.stringify({
              campaign_id: Number(campaignId),
            }),
          }
        );
        if (response.status === 200) {
          const data = await response.json();
          console.log(data);
          setTimeLeft(0);
          fetchCampaigns();
          setVerificationStatus(true);
        }
      } catch (error) {
        console.error(error);
      }
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 5000);

    return () => clearInterval(timer);
  }, [tweetVerificationOpen, timeLeft]);

  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // The actual KOL Dashboard layout and components
  return (
    <div className="min-h-screen bg-white">
      <AppHeader title="KOL Dashboard" />

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Your Promotions</h2>
        {campaigns && campaigns?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => {
              const offerEndTime = new Date(campaign.offer_end_date).getTime();
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
                Date.now() >= new Date(campaign.offer_end_date).getTime();
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
                      campaign.status === "accepted" ? (
                        <span>{formatTimeLeft(promotionTimeLeft)}</span>
                      ) : (
                        <span>
                          {{
                            fulfilled: "Fulfilled",
                            unfulfilled: "Unfulfilled",
                          }[campaign.status] || "Expired"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end items-center mt-3">
                    <div className="font-semibold text-sm text-ai-orange">
                      {campaign.amount} USDC
                    </div>
                  </div>

                  <div className="flex justify-end items-center mt-3 gap-2">
                    {!isExpired && (
                      <>
                        {campaign.status === "open" ? (
                          <Button
                            onClick={async () => {
                              setAiTweet("Generating tweet...");
                              setAcceptModalOpen(true);
                              const prompt = `Generate a tweet about ${campaign.project_name}. It should highlight: 
                              1. The project's core purpose: ${campaign.description}
                              2. Include the Twitter handle: ${campaign.x_author_handle}
                              3. Mention the website: ${campaign.website}
                              4. Keep it concise and engaging, under 280 characters.`;
                              const text = await fetch(
                                `${import.meta.env.VITE_GENERATE_TWEET_URL}`,
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify({
                                    prompt,
                                  }),
                                }
                              );
                              const data = await text.json();
                              setAiTweet(data.tweet);
                              setAcceptCampaignId(
                                campaign.campaign_id.toString()
                              );
                            }}
                          >
                            Accept
                          </Button>
                        ) : campaign.status === "accepted" ||
                          campaign.status === "unfulfilled" ? (
                          <Button
                            onClick={() => {
                              setCampaignId(campaign.campaign_id.toString());
                              setOpen(true);
                            }}
                          >
                            Claim
                          </Button>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>
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

      {campaignId && open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Tweet Link</DialogTitle>
            </DialogHeader>
            <Input
              type="url"
              placeholder="Enter your tweet link"
              value={tweetLink}
              onChange={(e) => setTweetLink(e.target.value)}
            />
            <DialogFooter>
              <Button
                onClick={() => {
                  setOpen(false);
                  setTweetVerificationOpen(true);
                }}
              >
                Submit
              </Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {acceptModalOpen && (
        <Dialog open={acceptModalOpen} onOpenChange={setAcceptModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accept Campaign</DialogTitle>
            </DialogHeader>

            <Textarea value={aiTweet} className="mb-4" disabled={true} />
            <DialogFooter>
              <Button
                onClick={() => {
                  acceptCampaign(acceptCampaignId);
                  setAcceptModalOpen(false);
                }}
              >
                Accept
              </Button>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAcceptModalOpen(false);
                    setAiTweet("");
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {tweetVerificationOpen && (
        <Dialog
          open={tweetVerificationOpen}
          onOpenChange={setTweetVerificationOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Verifying Your Tweet</DialogTitle>
            </DialogHeader>
            {timeLeft > 0 && (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="w-1/2 h-1/2 bg-gray-200 rounded-lg"></div>
                <p className="mt-4 text-sm text-gray-500">
                  Verification will complete in {Math.floor(timeLeft / 60)}:
                  {(timeLeft % 60).toString().padStart(2, "0")}
                </p>
              </div>
            )}
            {verificationStatus && (
              <div className="flex flex-col justify-center items-center h-full">
                <div className="w-1/2 h-1/2 bg-gray-200 rounded-lg"></div>
                <p className="mt-4 text-sm text-gray-500">
                  Verification successful!
                </p>
              </div>
            )}
            <DialogFooter>
              {verificationStatus || timeLeft > 0 ? (
                <Button
                  disabled={timeLeft > 0}
                  onClick={() => {
                    setTweetVerificationOpen(false);
                    claimCampaign(campaignId, tweetLink);
                  }}
                >
                  Complete Verification
                </Button>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    Verification failed. Please try again.
                  </p>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setTweetVerificationOpen(false)}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default KOLDashboard;

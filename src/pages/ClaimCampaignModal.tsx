import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useContract } from "@/hooks/useContract";

const ClaimCampaignModal = ({
  campaignId,
  onClaim,
}: {
  campaignId: string;
  onClaim: () => void;
}) => {
  const [tweetLink, setTweetLink] = useState("");
  const { toast } = useToast();
  const { contract } = useContract();

  const handleClaim = async () => {
    if (!tweetLink) {
      toast({
        title: "Error",
        description: "Please enter a tweet link.",
        variant: "destructive",
      });
      return;
    }

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

    if (response.status === 200) {
      await contract?.fulfilProjectCampaign("0xbd14075e");
      toast({
        title: "Campaign claimed",
        description: "You have successfully claimed the campaign.",
      });
      onClaim();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Claim</Button>
      </DialogTrigger>
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
          <Button onClick={handleClaim}>Submit</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimCampaignModal;

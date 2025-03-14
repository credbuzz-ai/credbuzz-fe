import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronsUpDown, User } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { useContract } from "@/hooks/useContract";
import { Campaign, KOL } from "@/lib/types";
import { ethers } from "ethers";
interface CreateCampaignFormProps {
  onCampaignCreated: (campaign: Campaign) => void;
  existingCampaign?: Campaign | null;
  onCancel?: () => void;
  fetchCampaigns: () => void;
  userId: number;
}

export function CreateCampaignForm({
  onCampaignCreated,
  existingCampaign = null,
  onCancel,
  fetchCampaigns,
  userId,
}: CreateCampaignFormProps) {
  const [formData, setFormData] = useState<Campaign>({
    campaign_id: 0,
    business_wallet_addr: "",
    kol_wallet_addr: "",
    status: "",
    project_name: "",
    description: "",
    x_author_handle: "",
    website: "",
    offer_end_date: 0,
    promotion_end_date: 0,
    amount: 0,
    business_user_id: userId,
    kol_user_id: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kols, setKols] = useState<KOL[]>([]);
  const [filteredKols, setFilteredKols] = useState<KOL[]>([]);
  const [isLoadingKols, setIsLoadingKols] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  // const { createNewCampaign, transferUSDC, updateCampaign } = useContract();

  // Initialize form with existing campaign data if editing
  useEffect(() => {
    if (existingCampaign) {
      const {
        offer_end_date,
        promotion_end_date,
        kol_user_id,
        project_name,
        description,
        x_author_handle,
        website,
        amount,
      } = existingCampaign;

      setFormData({
        ...existingCampaign,
        offer_end_date: offer_end_date,
        promotion_end_date: promotion_end_date,
        kol_user_id: kol_user_id,
        project_name: project_name,
        description: description,
        x_author_handle: x_author_handle,
        website: website,
        amount: amount,
      });
    } else {
      // Set default values when no existing campaign
      setFormData({
        campaign_id: 0,
        business_wallet_addr: "",
        kol_wallet_addr: "",
        status: "",
        project_name: "",
        description: "",
        x_author_handle: "",
        website: "",
        offer_end_date: 0,
        promotion_end_date: 0,
        amount: 0,
        business_user_id: userId,
        kol_user_id: 0,
      });
    }
  }, [existingCampaign]);

  const fetchKOLs = async () => {
    setIsLoadingKols(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/list-kols`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_TEST_API_KEY,
            source: import.meta.env.VITE_SOURCE,
          },
        }
      );
      const data = await response.json();

      setKols(data.result);
      setFilteredKols(data.result);
    } catch (error) {
      console.error("Error fetching KOLs:", error);
      toast({
        title: "Error",
        description: "Failed to load KOL list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingKols(false);
    }
  };

  // Fetch KOLs from backend API
  useEffect(() => {
    fetchKOLs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "amount") {
      setFormData({
        ...formData,
        amount: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          name === "offer_end_date" || name === "promotion_end_date"
            ? new Date(value).getTime()
            : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let requestBody = {};
      let url = "";

      if (existingCampaign) {
        url = `${import.meta.env.VITE_BASE_URL}/update-campaign`;
        requestBody = {
          campaign_id: existingCampaign.campaign_id,
          kol_wallet_addr: formData.kol_wallet_addr,
          project_name: formData.project_name,
          description: formData.description,
          x_author_handle: formData.x_author_handle,
          website: formData.website,
          amount: formData.amount,
          offer_end_date: formData.offer_end_date,
          promotion_end_date: formData.promotion_end_date,
        };
      } else {
        url = `${import.meta.env.VITE_BASE_URL}/create-campaign`;
        requestBody = {
          business_user_id: formData.business_user_id,
          kol_user_id: formData.kol_user_id,
          project_name: formData.project_name,
          description: formData.description,
          x_author_handle: formData.x_author_handle,
          website: formData.website,
          amount: formData.amount,
          offer_end_date: formData.offer_end_date,
          promotion_end_date: formData.promotion_end_date,
        };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_TEST_API_KEY,
          source: import.meta.env.VITE_SOURCE,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to save campaign");
      }

      // Add the selected KOL's name to the campaign data
      const campaignData = { ...formData };
      if (formData.kol_wallet_addr) {
        const selectedKol = kols.find(
          (kol) => kol.wallet_addr === formData.kol_wallet_addr
        );
        if (selectedKol) {
          campaignData.x_author_handle = selectedKol.author_handle;
        }
      }

      onCampaignCreated(campaignData);

      const userData = await fetch(
        `${import.meta.env.VITE_BASE_URL}/get-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_TEST_API_KEY,
            source: import.meta.env.VITE_SOURCE,
          },
          body: JSON.stringify({
            user_id: formData.kol_user_id,
          }),
        }
      );

      const userDetails = await userData.json();

      const campaignId = data.result.campaign_id[0][0];

      console.log(data);
      console.log(campaignId);
      console.log(typeof campaignId);
      console.log(!existingCampaign);
      console.log(!existingCampaign && campaignId);
      if (!existingCampaign && campaignId) {
        console.log(data);
        console.log(campaignId);
        console.log(typeof campaignId);
        // todo: wallet address is mandatory
        // await createNewCampaign(
        //   userDetails.result.wallet_addr,
        //   Number(ethers.parseUnits(campaignData.amount.toString(), 6)),
        //   Number(campaignData.promotion_end_date),
        //   Number(campaignData.offer_end_date),
        //   campaignId
        // );
        // await transferUSDC(
        //   Number(ethers.parseUnits(campaignData.amount.toString(), 6))
        // );
      } else {
        // todo
        // await updateCampaign(
        //   existingCampaign.campaign_id.toString(),
        //   userDetails.result.wallet_addr,
        //   Number(campaignData.promotion_end_date),
        //   Number(campaignData.offer_end_date)
        // );

        if (existingCampaign.amount < campaignData.amount) {
          // await transferUSDC(
          //   Number(
          //     ethers.parseUnits(
          //       (campaignData.amount - existingCampaign.amount).toString(),
          //       6
          //     )
          //   )
          // );
        }
      }

      // Only reset form if not in edit mode
      if (!existingCampaign) {
        setFormData({
          campaign_id: 0,
          business_wallet_addr: "",
          kol_wallet_addr: "",
          status: "",
          project_name: "",
          description: "",
          x_author_handle: "",
          website: "",
          offer_end_date: 0,
          promotion_end_date: 0,
          amount: 0,
          kol_user_id: 0,
          business_user_id: userId,
        });
      }
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast({
        title: "Error",
        description: "Failed to save campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      fetchCampaigns();
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid gap-2">
        <Label htmlFor="project_name">Project Name</Label>
        <Input
          id="project_name"
          name="project_name"
          value={formData.project_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="grid gap-2">
        <Label>Select KOL (Optional)</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {formData.kol_user_id
                ? kols
                    .find((kol) => kol.user_id === formData.kol_user_id)
                    ?.author_handle.slice(0, 6) + "..."
                : "Select KOL..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <div className="flex flex-col">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="Search KOL..."
                value={searchQuery}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSearchQuery("");
                    setFilteredKols(kols);
                  } else {
                    setSearchQuery(e.target.value);
                    setFilteredKols(
                      kols.filter((kol) =>
                        kol.author_handle
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      )
                    );
                  }
                }}
              />
              {isLoadingKols ? (
                <div className="py-2 px-3 text-sm">Loading...</div>
              ) : filteredKols.length === 0 ? (
                <div className="py-2 px-3 text-sm">No KOLs available</div>
              ) : (
                <div className="overflow-y-auto max-h-[300px]">
                  {filteredKols.map((kol) => (
                    <div
                      key={kol.user_id}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          kol_user_id:
                            prev.kol_user_id === kol.user_id ? 0 : kol.user_id,
                        }));
                        setOpen(false);
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{kol.author_handle}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="x_author_handle">X Account</Label>
          <Input
            id="x_author_handle"
            name="x_author_handle"
            value={formData.x_author_handle}
            onChange={handleChange}
            placeholder="@username"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="offerEnds">Offer Ends (in seconds)</Label>
          {existingCampaign ? (
            <Input
              id="offer_end_date"
              name="offer_end_date"
              type="datetime-local"
              value={
                formData.offer_end_date
                  ? new Date(formData.offer_end_date).toISOString().slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              required
              min="0"
            />
          ) : (
            <Input
              id="offer_end_date"
              name="offer_end_date"
              type="datetime-local"
              value={
                formData.offer_end_date
                  ? new Date(formData.offer_end_date).toISOString().slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              required
              min="0"
            />
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="promotionEnds">Promotion Ends (in seconds)</Label>
          {existingCampaign ? (
            <Input
              id="promotion_end_date"
              name="promotion_end_date"
              type="datetime-local"
              value={
                formData.promotion_end_date
                  ? new Date(formData.promotion_end_date)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              required
              min="0"
            />
          ) : (
            <Input
              id="promotion_end_date"
              name="promotion_end_date"
              type="datetime-local"
              value={
                formData.promotion_end_date
                  ? new Date(formData.promotion_end_date)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              required
              min="0"
            />
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">Amount in USDC</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount || ""}
          onChange={handleChange}
          required
          // min="0"
          step="0.01"
        />
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-ai-orange hover:bg-ai-darkOrange"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? existingCampaign
              ? "Updating..."
              : "Creating..."
            : existingCampaign
            ? "Update Campaign"
            : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}

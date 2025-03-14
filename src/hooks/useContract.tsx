import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MarketplaceAbi from "../abis/Marketplace.json";
import IERC20Abi from "../abis/IERC20.json";
// Replace with your deployed contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS;

// Add USDC ABI - we only need transfer function
const USDC_ABI = IERC20Abi;

export const useContract = () => {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [usdcContract, setUsdcContract] = useState<ethers.Contract | null>(
    null
  );
  const gasLimit = 3000000;

  useEffect(() => {
    const initContract = async () => {
      try {
        // Check if window.ethereum is available
        if (typeof window.ethereum !== "undefined") {
          // Create a new Web3Provider
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);

          // Get the signer
          const contractSigner = await web3Provider.getSigner();
          setSigner(contractSigner);

          // Create contract instance
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            MarketplaceAbi,
            contractSigner
          );
          setContract(contractInstance);

          // Initialize USDC contract
          const usdcInstance = new ethers.Contract(
            USDC_ADDRESS,
            USDC_ABI,
            contractSigner
          );
          setUsdcContract(usdcInstance);
        } else {
          console.error("Please install MetaMask!");
        }
      } catch (error) {
        console.error("Error initializing contract:", error);
      }
    };

    initContract();
  }, []);

  // User Functions
  const register = async () => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.register({
        gasLimit,
      });
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  // Campaign Functions
  const createNewCampaign = async (
    selectedKol: string,
    offeringAmount: number,
    promotionEndsIn: number,
    offerEndsIn: number,
    campaignId: number
  ) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.createNewCampaign(
        selectedKol,
        offeringAmount,
        promotionEndsIn,
        offerEndsIn,
        {
          gasLimit,
        }
      );
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw error;
    }
  };

  const updateCampaign = async (
    campaignId: number,
    selectedKol: string,
    promotionEndsIn: number,
    offerEndsIn: number
  ) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.updateCampaign(
        campaignId,
        selectedKol,
        promotionEndsIn,
        offerEndsIn,
        {
          gasLimit,
        }
      );
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error updating campaign:", error);
      throw error;
    }
  };

  // Owner Functions
  const acceptProjectCampaign = async (campaignId: number) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.acceptProjectCampaign(campaignId, {
        gasLimit,
      });
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error accepting campaign:", error);
      throw error;
    }
  };

  const fulfilProjectCampaign = async (campaignId: number) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.fulfilProjectCampaign(campaignId, {
        gasLimit,
      });
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error fulfilling campaign:", error);
      throw error;
    }
  };

  const discardCampaign = async (campaignId: number) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.discardCampaign(campaignId, {
        gasLimit,
      });
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error discarding campaign:", error);
      throw error;
    }
  };

  const updatePlatformFees = async (newFees: number) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      const tx = await contract.updatePlatformFees(newFees, {
        gasLimit,
      });
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error updating platform fees:", error);
      throw error;
    }
  };

  // Getter Functions
  const getAllUsers = async () => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getAllUsers();
    } catch (error) {
      console.error("Error getting all users:", error);
      throw error;
    }
  };

  const getAllCampaigns = async () => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getAllCampaigns();
    } catch (error) {
      console.error("Error getting all campaigns:", error);
      throw error;
    }
  };

  const getUserCampaigns = async (userAddress: string) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getUserCampaigns(userAddress);
    } catch (error) {
      console.error("Error getting user campaigns:", error);
      throw error;
    }
  };

  const getCampaignInfo = async (campaignId: number) => {
    try {
      if (!contract) throw new Error("Contract not initialized");
      return await contract.getCampaignInfo(campaignId);
    } catch (error) {
      console.error("Error getting campaign info:", error);
      throw error;
    }
  };

  // Add USDC transfer function
  const transferUSDC = async (amount: number) => {
    try {
      if (!usdcContract) throw new Error("USDC contract not initialized");

      const tx = await usdcContract.transfer(CONTRACT_ADDRESS, amount);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error("Error transferring USDC:", error);
      throw error;
    }
  };

  return {
    provider,
    signer,
    contract,
    usdcContract,
    // User Functions
    register,
    // Campaign Functions
    createNewCampaign,
    updateCampaign,
    // Owner Functions
    acceptProjectCampaign,
    fulfilProjectCampaign,
    discardCampaign,
    updatePlatformFees,
    // Getter Functions
    getAllUsers,
    getAllCampaigns,
    getUserCampaigns,
    getCampaignInfo,
    transferUSDC,
  };
};

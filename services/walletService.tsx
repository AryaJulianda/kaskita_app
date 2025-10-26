import { ResponseType, WalletType } from "@/types";
import { uploadToCloudinary } from "@/utils/getProfileImage";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  let walletToSave = { ...walletData };

  try {
    if (walletData.image) {
      const imageUploadRes = await uploadToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadRes.success) {
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload wallet icon",
        };
      }
      walletToSave.image = imageUploadRes.data;
    }

    if (!walletData?.id) {
      // new wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    return { success: true };
  } catch (error: any) {
    console.log("error when create or update wallet", error);
    return { success: false, msg: error.message, data: null };
  }
};

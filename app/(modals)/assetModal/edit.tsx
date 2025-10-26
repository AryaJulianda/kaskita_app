import BackButton from "@/components/BackButton";
import DeleteIcon from "@/components/DeleteButton";
import AssetForm, { AssetFormData } from "@/components/Form/AssetForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { useAssetStore } from "@/stores/assetStrore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert } from "react-native";

const EditAsset = () => {
  const router = useRouter();
  const {
    getAssetCategories,
    isLoading,
    editAsset,
    assetCategories,
    detailAsset,
    deleteAsset
  } = useAssetStore();

  useEffect(() => {
    getAssetCategories();
  }, []);

  const onSubmit = async (payload: AssetFormData) => {
    await editAsset(payload);
    router.push("/asset");
  };

  const handleDelete = async () => {
    if (!detailAsset?.id) return;

    Alert.alert("Confirm", "Are you sure to delete this asset?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteAsset(detailAsset.id);
          router.push("/asset");
        },
      },
    ]);
  };

  return (
    <ModalWrapper>
      <Header
        title="Edit Asset"
        leftIcon={<BackButton path="/asset" />}
        rightIcon={<DeleteIcon onPress={handleDelete} />}
        style={{ marginBottom: spacingY._10 }}
      />
      <AssetForm
        submitLabel="Edit Asset"
        categories={assetCategories}
        onSubmit={onSubmit}
        loading={isLoading}
        initialData={{
          id: detailAsset.id,
          name: detailAsset.name,
          balance: new Intl.NumberFormat("id-ID").format(detailAsset.balance),
          category_id: detailAsset.category.id,
        }}
      />
    </ModalWrapper>
  );
};

export default EditAsset;

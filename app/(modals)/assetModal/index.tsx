import BackButton from "@/components/BackButton";
import AssetForm from "@/components/Form/AssetForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { useAssetStore } from "@/stores/assetStrore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

const AddAsset = () => {
  const router = useRouter();
  const { getAssetCategories, isLoading, createAsset, assetCategories } =
    useAssetStore();

  useEffect(() => {
    getAssetCategories();
  }, []);

  const onSubmit = async (payload: any) => {
    await createAsset(payload);
    router.push("/asset");
  };

  return (
    <ModalWrapper>
      <Header
        title="New Asset"
        leftIcon={<BackButton path="/asset" />}
        style={{ marginBottom: spacingY._10 }}
      />
      <AssetForm
        submitLabel="Add Asset"
        categories={assetCategories}
        onSubmit={onSubmit}
        loading={isLoading}
      />
    </ModalWrapper>
  );
};

export default AddAsset;

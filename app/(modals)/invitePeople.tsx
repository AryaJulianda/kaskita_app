import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { InputField } from "@/components/InputField";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { getProfileImage } from "@/utils/getProfileImage";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const InvitePeople = () => {
  const {
    user,
    generateInvitation,
    isLoading,
    invitationCode,
    invitationPasscode,
    invitationExpiredAt,
    acceptInvitation,
    getGroupDetail,
    groupDetail,
  } = useAuthStore();

  const [form, setForm] = useState({
    code: "",
    passcode: "",
  });

  const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);

  useEffect(() => {
    const isExpired =
      invitationExpiredAt && new Date(invitationExpiredAt) < new Date();
    const isMissingCode = !invitationCode || !invitationPasscode;

    if (isExpired || isMissingCode) {
      generateInvitation();
    }
    getGroupDetail();
  }, [invitationExpiredAt, invitationCode, invitationPasscode]);

  const handleJoin = async () => {
    if (!form.code || !form.passcode) {
      Alert.alert("Error", "Kode dan Passcode harus diisi");
      return;
    }
    console.log("Join with:", form);
    await acceptInvitation(form.code, form.passcode);
    setIsJoinModalVisible(false);
  };

  return (
    <ModalWrapper>
      <View className="flex-1 px-5">
        <Header
          title="Mencatat Bersama"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <View className="flex-1 justify-between">
          <View>
            <Typo
              size={16}
              fontWeight="700"
              style={{ marginBottom: spacingY._10 }}
            >
              Anggota Grup
            </Typo>

            {groupDetail?.users && groupDetail.users.length > 0 ? (
              <View className="gap-3">
                {groupDetail.users.map((member: any) => (
                  <View
                    key={member.id}
                    className="flex-row items-center gap-2.5 rounded-xl bg-neutral-100 px-2.5 py-2"
                  >
                    <View className="h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-200">
                      <Image
                        source={getProfileImage(member.image)}
                        className="h-full w-full rounded-full"
                      />
                    </View>
                    <Typo size={15} fontWeight="500">
                      {member.name}
                      {member.name == user?.name && " (Saya)"}
                    </Typo>
                  </View>
                ))}
              </View>
            ) : (
              <Typo size={14} color={colors.neutral500}>
                Belum ada anggota
              </Typo>
            )}
          </View>

          <View className="gap-4">
            {/* <Typo>
            Ajak Partnermu untuk mencatat keuangan bersama dengan membagikan
            kode undangan ini
          </Typo> */}

            {/* Kode & Passcode */}
            <View className="flex-row justify-between">
              <View>
                <Typo>Kode Undangan</Typo>
                <Typo
                  size={14}
                  className="rounded-lg bg-neutral-200 px-2.5 py-1.5"
                >
                  {invitationCode}
                </Typo>
              </View>
              <View>
                <Typo>Passcode</Typo>
                <Typo
                  size={14}
                  className="rounded-lg bg-neutral-200 px-2.5 py-1.5"
                >
                  {invitationPasscode}
                </Typo>
              </View>
            </View>

            {/* Tombol Salin */}
            <Button
              onPress={async () => {
                if (invitationCode && invitationPasscode) {
                  const copyText = `Ajak partnermu untuk mencatat keuangan bersama dengan memasukan Kode Undangan dan Passcode di halaman "Mencatat Bersama"

Kode Undangan:
${invitationCode}

Passcode:
${invitationPasscode}`;
                  await Clipboard.setStringAsync(copyText);
                  Alert.alert("Copied!", "Kode Undangan berhasil disalin");
                } else {
                  Alert.alert("Error", "Kode Invitation tidak ditemukan");
                }
              }}
            >
              <Typo color={colors.black} fontWeight={"700"}>
                Salin Undangan
              </Typo>
            </Button>

            {/* <Typo style={{ textAlign: "center" }}>
            atau, jika sudah mendapatkan undangan klik tombol di bawah ini
          </Typo> */}

            {/* Tombol buka modal */}
            <Button
              style={{ backgroundColor: colors.blue }}
              onPress={() => setIsJoinModalVisible(true)}
            >
              <Typo color={colors.black} fontWeight={"700"}>
                Masukan Kode Undangan
              </Typo>
            </Button>
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent
          visible={isJoinModalVisible}
          onRequestClose={() => setIsJoinModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 justify-end bg-black/50">
              <Pressable
                className="flex-1"
                onPress={() => setIsJoinModalVisible(false)}
              />

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                className="w-full"
              >
                <KeyboardAwareScrollView
                  enableOnAndroid
                  keyboardShouldPersistTaps="handled"
                  contentContainerClassName="flex-grow justify-end"
                  extraScrollHeight={Platform.OS === "ios" ? 20 : 270}
                >
                  <View
                    className="rounded-2xl bg-white p-5 pb-8"
                    style={{
                      elevation: 10,
                      shadowColor: "#000",
                      shadowOpacity: 0.25,
                      shadowRadius: 6,
                      shadowOffset: { width: 0, height: -2 },
                    }}
                  >
                    <Typo
                      size={18}
                      fontWeight="700"
                      className="text-center"
                      style={{ marginBottom: spacingY._15 }}
                    >
                      Masukan Kode Undangan
                    </Typo>

                    <View className="flex-row gap-2.5">
                      <InputField
                        label="Kode Undangan"
                        type="number"
                        value={form.code}
                        onChangeText={(val) => setForm({ ...form, code: val })}
                      />
                      <InputField
                        label="Passcode"
                        type="text"
                        value={form.passcode}
                        onChangeText={(val) =>
                          setForm({ ...form, passcode: val })
                        }
                      />
                    </View>

                    <Button
                      style={{
                        backgroundColor: colors.blue,
                        marginTop: spacingY._20,
                      }}
                      onPress={handleJoin}
                    >
                      <Typo color={colors.black} fontWeight="700">
                        Bergabung
                      </Typo>
                    </Button>
                  </View>
                </KeyboardAwareScrollView>
              </KeyboardAvoidingView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ModalWrapper>
  );
};

export default InvitePeople;

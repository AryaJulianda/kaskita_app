import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { InputField } from "@/components/InputField";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
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
  StyleSheet,
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
      <View style={styles.container}>
        <Header
          title="Mencatat Bersama"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View>
            <Typo
              size={16}
              fontWeight="700"
              style={{ marginBottom: spacingY._10 }}
            >
              Anggota Grup
            </Typo>

            {groupDetail?.users && groupDetail.users.length > 0 ? (
              <View style={{ gap: 12 }}>
                {groupDetail.users.map((member: any) => (
                  <View key={member.id} style={styles.memberItem}>
                    <View style={styles.memberImageWrapper}>
                      <Image
                        source={getProfileImage(member.image)}
                        style={styles.memberImage}
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

          <View style={{ flexDirection: "column", gap: 15 }}>
            {/* <Typo>
            Ajak Partnermu untuk mencatat keuangan bersama dengan membagikan
            kode undangan ini
          </Typo> */}

            {/* Kode & Passcode */}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View>
                <Typo>Kode Undangan</Typo>
                <Typo size={14} style={styles.codeBox}>
                  {invitationCode}
                </Typo>
              </View>
              <View>
                <Typo>Passcode</Typo>
                <Typo size={14} style={styles.codeBox}>
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
              style={{ backgroundColor: colors.skyblue }}
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
            <View style={styles.modalOverlay}>
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setIsJoinModalVisible(false)}
              />

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
                style={{ width: "100%" }}
              >
                <KeyboardAwareScrollView
                  enableOnAndroid
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                  }}
                  extraScrollHeight={Platform.OS === "ios" ? 20 : 270}
                >
                  <View style={styles.modalContent}>
                    <Typo
                      size={18}
                      fontWeight="700"
                      style={{
                        textAlign: "center",
                        marginBottom: spacingY._15,
                      }}
                    >
                      Masukan Kode Undangan
                    </Typo>

                    <View style={{ flexDirection: "row", gap: 10 }}>
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
                        backgroundColor: colors.skyblue,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingY._20,
  },
  codeBox: {
    backgroundColor: colors.neutral200,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  keyboardAvoiding: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacingX._20,
    paddingBottom: spacingY._30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
  },

  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.neutral100,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 10,
  },

  memberImageWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: colors.neutral200,
    justifyContent: "center",
    alignItems: "center",
  },

  memberImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    resizeMode: "cover",
  },
});

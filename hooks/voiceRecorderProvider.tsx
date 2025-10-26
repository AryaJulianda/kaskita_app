import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { Directory, DirectoryInfo, FileInfo, Paths } from "expo-file-system";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "react-native";

type VoiceCtx = {
  isReady: boolean;
  isRecording: boolean;
  start: () => Promise<void>;
  stop: () => Promise<string | null>;
};

const VoiceRecorderContext = createContext<VoiceCtx | null>(null);

export const VoiceRecorderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);
  const [isReady, setIsReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission Denied", "Akses mikrofon ditolak");
        return;
      }
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
      if (active) setIsReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const [createdAt, setCreatedAt] = useState<Date | null>(null);

  const start = async () => {
    if (!isReady) {
      Alert.alert("Recorder belum siap");
      return;
    }
    await recorder.prepareToRecordAsync();
    recorder.record();
    setIsRecording(true);
    setCreatedAt(new Date()); // simpan waktu mulai
  };

  const stop = async (): Promise<string | null> => {
    try {
      await recorder.stop();
      setIsRecording(false);

      if (createdAt) {
        const realUri = await getActualRecordingUri(createdAt);
        return realUri;
      }

      return recorder.uri ?? null;
    } catch {
      setIsRecording(false);
      return null;
    }
  };

  async function getActualRecordingUri(
    createdAt: Date
  ): Promise<string | null> {
    try {
      const files = new Directory(Paths.cache, "Audio").list();
      if (!files.length) return null;

      const fileInfos = files.map((file) => file.info());
      const validFiles = fileInfos.filter((f) => f.size && f.size > 0);
      if (validFiles.length === 0) return null;

      const targetTime = createdAt.getTime();
      let closest: DirectoryInfo | FileInfo | null = null;
      let minDiff = Infinity;

      for (const file of validFiles) {
        if (!file.creationTime || !file.uri) continue;
        const diff = Math.abs(file.creationTime - targetTime);
        if (diff < minDiff) {
          closest = file;
          minDiff = diff;
        }
      }

      return closest?.uri?.slice(0, -1) ?? null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  const value = useMemo(
    () => ({ isReady, isRecording, start, stop }),
    [isReady, isRecording]
  );

  return (
    <VoiceRecorderContext.Provider value={value}>
      {children}
    </VoiceRecorderContext.Provider>
  );
};

export const useVoiceRecorder = () => {
  const ctx = useContext(VoiceRecorderContext);
  if (!ctx)
    throw new Error(
      "useVoiceRecorder must be used within VoiceRecorderProvider"
    );
  return ctx;
};

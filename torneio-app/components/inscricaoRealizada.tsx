import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Modal, Portal, Button, Icon, useTheme } from "react-native-paper";

interface SuccessModalPaperProps {
  isVisible: boolean;
  onClose: () => void;
  message?: string;
  title?: string;
  onPrimaryAction?: () => void;
}

export default function SuccessModalPaper({
  isVisible,
  onClose,
  message,
  title,
  onPrimaryAction,
}: SuccessModalPaperProps) {
  const theme = useTheme();

  const handleOk = () => {
    onPrimaryAction?.();
    onClose();
  };

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={onClose}
        contentContainerStyle={[
          styles.modalView,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.contentContainer}>
          <Icon source="check-circle" color="#4CAF50" size={60} />

          <Text style={[styles.modalTitle, { color: theme.colors.onSurface }]}>
            {title || "Inscrição Realizada!"}
          </Text>

          <Text
            style={[styles.modalText, { color: theme.colors.onSurfaceVariant }]}
          >
            {message || "Parabéns! Sua inscrição foi confirmada com sucesso."}
          </Text>

          {/* 🔥 ÚNICO BOTÃO OK */}
          <Button
            mode="contained"
            onPress={handleOk}
            style={[styles.primaryButton, { backgroundColor: "#0A4438" }]}
            labelStyle={[styles.primaryButtonText, { color: "#FFFFFF" }]}
          >
            OK
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    marginHorizontal: 30,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
  },
  modalTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 24,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 22,
  },
  primaryButton: {
    width: "100%",
    borderRadius: 8,
  },
  primaryButtonText: {
    paddingVertical: 4,
    fontWeight: "bold",
  },
});

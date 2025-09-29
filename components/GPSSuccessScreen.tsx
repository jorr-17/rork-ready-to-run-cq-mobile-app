import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";

import { CheckCircle, ArrowLeft, Copy } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/constants/theme";

interface GPSSuccessScreenProps {
  referenceNumber: string;
  onClose: () => void;
}

export default function GPSSuccessScreen({ referenceNumber, onClose }: GPSSuccessScreenProps) {
  const { colors, getLogoUri, isDark } = useTheme();
  const [showCopiedToast, setShowCopiedToast] = useState<boolean>(false);

  const copyReference = async () => {
    try {
      await Clipboard.setStringAsync(referenceNumber);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2000);
    } catch (error) {
      console.error('Failed to copy reference:', error);
    }
  };

  return (
    <View style={[styles.successContainer, { backgroundColor: colors.bgElevated }]}>
      <View style={styles.successContent}>
        {/* Ready to Run CQ Logo */}
        <View style={styles.logoContainer}>
          <Image
            key={isDark ? 'dark-logo' : 'light-logo'}
            source={{ uri: getLogoUri() }}
            style={[
              styles.logoImage,
              isDark && { tintColor: '#FFFFFF' }
            ]}
            resizeMode="contain"
          />
        </View>
        
        {/* Large Green Checkmark */}
        <CheckCircle size={80} color="#22C55E" style={styles.successIcon} />
        
        {/* Headline Text */}
        <Text style={[styles.successTitle, { color: '#000000' }]}>
          Thanks, your GPS problem has been submitted!
        </Text>
        
        {/* Reference Number with Copy Button */}
        <View style={styles.referenceContainer}>
          <Text style={[styles.referenceLabel, { color: '#666666' }]}>Reference #: </Text>
          <Text style={[styles.referenceNumber, { color: '#000000' }]}>{referenceNumber}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyReference}>
            <Copy size={16} color="#22C55E" />
          </TouchableOpacity>
        </View>
        
        {/* Subtext */}
        <Text style={[styles.successMessage, { color: '#666666' }]}>
          Our team will be in touch shortly.
        </Text>
        
        {/* Tagline */}
        <Text style={[styles.tagline, { color: '#22C55E' }]}>
          Keeping your machinery running – Ready to Run CQ
        </Text>
        
        {/* Back to Dashboard Button */}
        <TouchableOpacity
          style={[styles.successButton, { backgroundColor: '#22C55E' }]}
          onPress={onClose}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text style={styles.successButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
      
      {/* Copied Toast */}
      {showCopiedToast && (
        <View style={styles.toastContainer}>
          <View style={[styles.toast, { backgroundColor: '#22C55E' }]}>
            <Text style={styles.toastText}>Copied!</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successContent: {
    alignItems: "center",
    maxWidth: 400,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  logoImage: {
    width: 280,
    height: 80,
  },
  successIcon: {
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold" as const,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: 16,
    fontStyle: "italic" as const,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  successButton: {
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  successButtonText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
  },
  referenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  referenceLabel: {
    fontSize: 16,
  },
  referenceNumber: {
    fontSize: 16,
    fontWeight: "bold" as const,
    marginRight: 8,
  },
  copyButton: {
    padding: 4,
  },
  toastContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  toastText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
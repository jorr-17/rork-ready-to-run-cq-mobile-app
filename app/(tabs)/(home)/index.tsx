import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Platform,
} from "react-native";

import { Camera, Wrench, Phone, Mail, MessageSquare, MapPin } from "lucide-react-native";
import { useTheme } from "@/constants/theme";
import { heroData, contactsData, addressData } from "@/data/services";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const { colors, getLogoUri, isDark } = useTheme();
  const router = useRouter();

  const handleCall = () => {
    Linking.openURL(`tel:${contactsData.jed.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${contactsData.office.email}`);
  };

  const handleEnquiry = () => {
    router.push('/contact');
  };

  const handleLocation = () => {
    const address = `${addressData.line1}, ${addressData.city}, ${addressData.state} ${addressData.postcode}`;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleSnapSend = () => {
    router.push('/snap-send');
  };

  const handleGPSTroubleshooting = () => {
    router.push('/gps-diagnostic');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgElevated }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
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

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/88ig830ij16y0gfzmycye" }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={[styles.heroOverlay, { backgroundColor: `${colors.tint}E6` }]}>
            <Text style={styles.heroTitle}>{heroData.title}</Text>
            <Text style={styles.heroSubtitle}>{heroData.subtitle}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]} onPress={handleCall}>
              <Phone size={20} color={colors.tint} style={styles.actionIcon} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Call Mobile</Text>
              <Text style={[styles.actionButtonSubtext, { color: colors.textMuted }]}>0448 620 568</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]} onPress={handleEmail}>
              <Mail size={20} color={colors.tint} style={styles.actionIcon} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Email</Text>
              <Text style={[styles.actionButtonSubtext, { color: colors.textMuted }]}>Get in touch</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]} onPress={handleEnquiry}>
              <MessageSquare size={20} color={colors.tint} style={styles.actionIcon} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Enquiry Form</Text>
              <Text style={[styles.actionButtonSubtext, { color: colors.textMuted }]}>Send message</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]} onPress={handleLocation}>
              <MapPin size={20} color={colors.tint} style={styles.actionIcon} />
              <Text style={[styles.actionButtonText, { color: colors.text }]}>Get Directions</Text>
              <Text style={[styles.actionButtonSubtext, { color: colors.textMuted }]}>Emerald, QLD</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* GPS Troubleshooting Link */}
        <TouchableOpacity 
          style={[styles.gpsButton, { backgroundColor: colors.card }]} 
          onPress={handleGPSTroubleshooting}
        >
          <Wrench size={24} color={colors.tint} />
          <View style={styles.gpsTextContainer}>
            <Text style={[styles.gpsTitle, { color: colors.text }]}>Ag Leader GPS Troubleshooting</Text>
            <Text style={[styles.gpsSubtitle, { color: colors.textMuted }]}>Access support resources</Text>
          </View>
        </TouchableOpacity>

        {/* Snap & Send CTA */}
        <TouchableOpacity 
          style={[styles.snapSendButton, { backgroundColor: colors.tint }]} 
          onPress={handleSnapSend}
        >
          <Camera size={28} color="#FFFFFF" />
          <View style={styles.snapSendTextContainer}>
            <Text style={styles.snapSendTitle}>Snap & Send</Text>
            <Text style={styles.snapSendSubtitle}>Report machinery issues instantly</Text>
          </View>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  logoSection: {
    paddingTop: 40,
    paddingHorizontal: 30,
    paddingBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 280,
    height: 80,
  },
  heroSection: {
    height: 200,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.95,
    lineHeight: 20,
  },

  quickActionsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  quickActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 2,
  },
  actionButtonSubtext: {
    fontSize: 12,
  },
  actionIcon: {
    marginBottom: 8,
  },
  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  gpsTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  gpsTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  gpsSubtitle: {
    fontSize: 14,
  },
  snapSendButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  snapSendTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  snapSendTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  snapSendSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  bottomSpacing: {
    height: 20,
  },
});
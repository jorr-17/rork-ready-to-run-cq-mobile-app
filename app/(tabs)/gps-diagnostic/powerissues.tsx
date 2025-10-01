import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from "react-native";

import { Phone, MessageCircle, AlertTriangle, Download, Camera, Upload, Zap } from "lucide-react-native";

import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "@/constants/theme";
import GPSForm from "@/components/GPSForm";
import GPSSuccessScreen from "@/components/GPSSuccessScreen";

export default function PowerIssuesScreen() {
  const { colors } = useTheme();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");


  const handleTakePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera is not available on web. Please use the upload photo option.');
      return;
    }
    
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImageUris = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...newImageUris]);
      handleSendPhotos([...selectedImages, ...newImageUris]);
    }
  };

  const handleUploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Photo library permission is required to upload photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImageUris = result.assets.map(asset => asset.uri);
      setSelectedImages(prev => [...prev, ...newImageUris]);
      handleSendPhotos([...selectedImages, ...newImageUris]);
    }
  };



  const handleSendPhotos = (imageUris: string[]) => {
    console.log('Photos selected:', imageUris.length);
    setSelectedImages(imageUris);
    setShowForm(true);
  };

  const handleFormSuccess = (refNumber: string) => {
    setReferenceNumber(refNumber);
    setShowForm(false);
    setShowSuccess(true);
    setSelectedImages([]);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedImages([]);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setReferenceNumber("");
  };

  if (showSuccess) {
    return <GPSSuccessScreen referenceNumber={referenceNumber} onClose={handleSuccessClose} />;
  }

  if (showForm && selectedImages.length > 0) {
    return (
      <GPSForm 
        imageUris={selectedImages} 
        onSuccess={handleFormSuccess} 
        onCancel={handleFormCancel} 
      />
    );
  }

  return (
      <View style={[styles.container, { backgroundColor: colors.bgElevated }]}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        <View style={[styles.updateNotice, { backgroundColor: colors.warning }]}>
          <View style={styles.updateNoticeContent}>
            <View style={styles.updateTextContainer}>
              <Text style={styles.updateTitle}>⚠️ Ensure Latest Software</Text>
              <Text style={styles.updateText}>
                Before troubleshooting, verify you&apos;re running the latest Ag Leader software. Updates often resolve common GPS issues.
              </Text>
              <View style={styles.updateOptions}>
                <TouchableOpacity
                  style={styles.updateLink}
                  onPress={() => Linking.openURL("https://portal.agleader.com/community/s/topic/0TOf400000099NMGAY/displays?language=en_US")}
                  activeOpacity={0.8}
                >
                  <Download size={16} color="#FFFFFF" />
                  <Text style={styles.updateLinkText}>Download via USB from Portal</Text>
                </TouchableOpacity>
                <Text style={styles.updateDivider}>or</Text>
                <Text style={styles.updateMethodText}>Update via AgFiniti Cloud</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
          <View style={styles.headerTitleRow}>
            <Zap size={32} color={colors.tint} />
            <Text style={[styles.headerTitle, { color: colors.text }]}>Power / Electrical Issues</Text>
          </View>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Your display or receiver randomly restarts, steering cuts out, or the system fails to power on.
          </Text>
        </View>

        <View style={[styles.preventionNotice, { backgroundColor: colors.success }]}>
          <Text style={styles.preventionTitle}>🎯 #1 Solution: Inspect Power Supply & Ground</Text>
          <Text style={styles.preventionText}>
            Ensure display and GPS harnesses are connected to a clean 12V power source. Check grounds — poor grounding causes spikes and shutdowns. Inspect battery terminals and alternator output.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Steps</Text>
          
          <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Check Voltage</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                With engine running, measure 12–14V at the display power plug. Low voltage = charging issue.
              </Text>
            </View>
          </View>

          <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Inspect Harness & Fuses</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                Replace any corroded, burnt, or loose fuses/wires.
              </Text>
            </View>
          </View>

          <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Check for Overdraw</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                Avoid running high-draw accessories (fridges, radios, lights) on the same circuit.
              </Text>
            </View>
          </View>

          <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Look for Short Circuits</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                Damaged wires rubbing on the cab or frame can cause resets.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.additionalSection, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.additionalTitle, { color: colors.text }]}>Prevention</Text>
          <View style={styles.additionalList}>
            <View style={[styles.additionalItem, { backgroundColor: colors.bgElevated, borderColor: colors.divider }]}>
              <View style={[styles.bulletPoint, { backgroundColor: colors.tint }]} />
              <Text style={[styles.additionalText, { color: colors.textMuted }]}>
                Use dedicated power leads direct from the battery with proper fusing.
              </Text>
            </View>
            <View style={[styles.additionalItem, { backgroundColor: colors.bgElevated, borderColor: colors.divider }]}>
              <View style={[styles.bulletPoint, { backgroundColor: colors.tint }]} />
              <Text style={[styles.additionalText, { color: colors.textMuted }]}>
                Perform preseason checks on all harnesses.
              </Text>
            </View>
            <View style={[styles.additionalItem, { backgroundColor: colors.bgElevated, borderColor: colors.divider }]}>
              <View style={[styles.bulletPoint, { backgroundColor: colors.tint }]} />
              <Text style={[styles.additionalText, { color: colors.textMuted }]}>
                Replace damaged wiring before it strands you in the field.
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.photoSection, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.photoSectionTitle, { color: colors.text }]}>Upload Display Screen Photo</Text>
          <Text style={[styles.photoSectionDescription, { color: colors.textMuted }]}>
            Take photos or upload images of your display screen, power connections, and any error messages to help our specialists diagnose the power issue.
          </Text>
          
          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesPreview}>
              <Text style={[styles.selectedImagesText, { color: colors.text }]}>
                {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
              </Text>
              <TouchableOpacity
                style={[styles.clearImagesButton, { backgroundColor: colors.textMuted }]}
                onPress={() => setSelectedImages([])}
                activeOpacity={0.8}
              >
                <Text style={styles.clearImagesText}>Clear All</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.photoButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.photoButton, 
                { 
                  backgroundColor: Platform.OS === 'web' ? colors.textMuted : colors.tint,
                  opacity: Platform.OS === 'web' ? 0.6 : 1
                }
              ]}
              onPress={handleTakePhoto}
              activeOpacity={0.8}
              disabled={Platform.OS === 'web'}
            >
              <Camera size={24} color="#FFFFFF" />
              <Text style={styles.photoButtonText}>
                {Platform.OS === 'web' ? 'Camera N/A' : 'Take Photo'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.photoButton, { backgroundColor: colors.warning }]}
              onPress={handleUploadPhoto}
              activeOpacity={0.8}
            >
              <Upload size={24} color="#FFFFFF" />
              <Text style={[styles.photoButtonText, { textAlign: "center" }]}>Upload Photos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.photoHelpText}>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Take clear photos of power connections and battery terminals
            </Text>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Include photos of any burnt or damaged wiring
            </Text>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Show any error messages on the display
            </Text>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • You can select up to 5 photos at once
            </Text>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Photos will be uploaded securely and sent to our GPS specialist for quick diagnosis
            </Text>
          </View>
        </View>

        <View style={[styles.emergencySection, { backgroundColor: colors.danger }]}>
          <AlertTriangle size={24} color="#FFFFFF" />
          <Text style={styles.emergencyTitle}>Still Having Power Issues?</Text>
          <Text style={styles.emergencyText}>
            If you&apos;ve checked all power connections and still experience shutdowns or restarts, contact our Ag Leader Dealer GPS specialists for assistance.
          </Text>
          <View style={styles.emergencyButtons}>
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              onPress={() => Linking.openURL("tel:0448620568")}
            >
              <Phone size={18} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>Call Specialist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
              onPress={() => Linking.openURL("sms:0448620568?body=Ag Leader GPS - Power Issues: ")}
            >
              <MessageCircle size={18} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginBottom: 8,
  },
  stepCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold" as const,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    flex: 1,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 22,
    paddingLeft: 0,
    marginBottom: 8,
  },
  stepContent: {
    paddingLeft: 0,
    gap: 8,
  },
  additionalSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  additionalTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    marginBottom: 16,
  },
  additionalList: {
    gap: 12,
  },
  additionalItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  additionalText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  emergencySection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.9,
    lineHeight: 20,
  },
  emergencyButtons: {
    flexDirection: "row",
    gap: 12,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  updateNotice: {
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  updateNoticeContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  updateTextContainer: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 17,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: 6,
    textAlign: "center",
  },
  updateText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    opacity: 0.95,
    marginBottom: 12,
    textAlign: "center",
  },
  updateOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  updateLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  updateLinkText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  updateDivider: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.8,
    marginHorizontal: 4,
  },
  updateMethodText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    opacity: 0.95,
  },
  photoSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  photoSectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    marginBottom: 8,
  },
  photoSectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  photoButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 6,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    textAlign: "center",
  },
  photoHelpText: {
    gap: 4,
  },
  photoHelpItem: {
    fontSize: 13,
    lineHeight: 18,
  },

  bottomSpacing: {
    height: 20,
  },

  preventionNotice: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preventionTitle: {
    fontSize: 17,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: 6,
  },
  preventionText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    opacity: 0.95,
  },
  selectedImagesPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  selectedImagesText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  clearImagesButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearImagesText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});

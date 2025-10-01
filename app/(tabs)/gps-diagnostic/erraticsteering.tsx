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

import { Phone, MessageCircle, AlertTriangle, Download, Camera, ArrowUp } from "lucide-react-native";

import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "@/constants/theme";
import GPSForm from "@/components/GPSForm";
import GPSSuccessScreen from "@/components/GPSSuccessScreen";

export default function ErraticSteeringScreen() {
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Erratic or Poor Steering</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            If your machine feels jumpy, zig-zaggy, or won&apos;t hold a straight line, it is often related to the wheel angle sensor (WAS). This sensor tells the steering system exactly where the wheels are pointing. If the information is wrong or inconsistent, steering accuracy will suffer.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Diagnostic Steps</Text>
          
          <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Check Bracket and Rods</Text>
            </View>
            <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
              Inspect near the axle to make sure the sensor bracket and connecting rods are secure, not bent, damaged, or loose.
            </Text>
          </View>

          <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Check On-Screen Reading</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                Open the steering diagnostics page.
              </Text>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                Slowly turn the steering wheel left and right.
              </Text>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                The wheel angle reading should move smoothly. If it jumps, freezes, or behaves irregularly, the sensor may be faulty.
              </Text>
            </View>
          </View>

          <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Run a Wheel Angle Sensor Calibration</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                Perform a calibration in the steering menu.
              </Text>
              <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                This often resolves small errors and resets the system.
              </Text>
            </View>
          </View>

          <View style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text }]}>Watch for Warnings</Text>
            </View>
            <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
              If the sensor is faulty, the system will normally display a message such as &quot;Check WAS.&quot;
            </Text>
          </View>
        </View>

        <View style={[styles.helpSection, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.helpTitle, { color: colors.text }]}>Still Having Issues?</Text>
          <Text style={[styles.helpText, { color: colors.textMuted }]}>
            If steering problems continue after calibration, contact us. Please let us know what you observed on the diagnostics screen and whether the system displayed a warning, as this will help us diagnose the issue faster.
          </Text>
        </View>

        <View style={[styles.photoSection, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.photoSectionTitle, { color: colors.text }]}>Upload Steering Problem Photo</Text>
          <Text style={[styles.photoSectionDescription, { color: colors.textMuted }]}>
            Take photos or upload multiple images of your steering problem to help our specialists diagnose the issue.
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
              <ArrowUp size={20} color="#FFFFFF" style={{ flexShrink: 0 }} />
              <Text style={styles.photoButtonText}>Upload Photos</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.photoHelpText}>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Take photos of the wheel angle sensor and mounting brackets
            </Text>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Include photos of any error messages on the display
            </Text>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Show the steering diagnostics screen if possible
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
          <Text style={styles.emergencyTitle}>Still Having Steering Issues?</Text>
          <Text style={styles.emergencyText}>
            If you&apos;ve completed all troubleshooting steps and still have steering problems, contact our Ag Leader Dealer GPS specialists immediately.
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
              onPress={() => Linking.openURL("sms:0448620568?body=Ag Leader GPS - Steering Issue: ")}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    marginBottom: 12,
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
    textAlign: "left",
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
  helpSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 22,
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
  updateIcon: {
    marginRight: 12,
    marginTop: 2,
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "500" as const,
    color: "#FFFFFF",
    lineHeight: 16,
  },
  photoHelpText: {
    gap: 4,
  },
  photoHelpItem: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
    paddingLeft: 0,
    textAlign: "left",
  },

  bottomSpacing: {
    height: 20,
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

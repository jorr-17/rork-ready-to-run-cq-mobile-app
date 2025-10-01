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

import { Satellite, Phone, MessageCircle, AlertTriangle, CheckCircle, Wrench, Download, Camera, Upload } from "lucide-react-native";

import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "@/constants/theme";
import GPSForm from "@/components/GPSForm";
import GPSSuccessScreen from "@/components/GPSSuccessScreen";

interface TroubleshootingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  satelliteType?: "grey" | "yellow";
  steps: string[];
}

export default function NoGPSScreen() {
  const { colors } = useTheme();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");


  const greyColor = "#8B8B8B";
  const yellowColor = "#FFD700";

  const troubleshootingSteps: TroubleshootingStep[] = [
    {
      title: "Grey Satellite – What It Means",
      description: "A grey satellite icon means your display isn't receiving GPS data from the receiver, or not connected to the steering controller.",
      icon: <Satellite size={32} color={greyColor} />,
      satelliteType: "grey",
      steps: [
        "Check Ethernet Cable – make sure the Ethernet cable is securely connected between the display and the steering controller.",
        "Verify Steering System Selection – ensure the correct system (ParaDyme, GeoSteer, OnTrac, etc.) is chosen under GPS/Guidance setup. Use the wrench icon to test connection.",
        "Switch to Manual Guidance – if communication fails, try Manual Guidance. If the satellite turns green, the issue likely lies with communication to the steering controller.",
        "Confirm NMEA Settings – ensure GGA and VTG are enabled at 10/20 Hz and the baud rate is at least 38,400.",
        "Reset to Defaults – if it's still grey after all steps, tap 'Reset to Defaults.'",
        "Still Not Working? – contact your Ag Leader Dealer or Technical Support for further help."
      ]
    },
    {
      title: "Yellow Satellite – What it Means",
      description: "A yellow satellite means your GPS receiver is connected to a satellite in the sky, but it is not receiving a correction source. This is most commonly related to your base station not supplying corrections. Without corrections, accuracy will be reduced.",
      icon: <Satellite size={32} color={yellowColor} />,
      satelliteType: "yellow",
      steps: [
        "Check Base Station Channel|Make sure your receiver is tuned to the correct base station channel number.",
        "Verify Base Station Operation|Confirm that the base station is powered on and actively transmitting corrections.",
        "Cross-Check With Another Machine (if available)|Test another machine with a different GPS system. If it also fails to receive corrections, the issue is likely with the base station itself.",
        "Confirm Correction Source Selection|If the base station is working, ensure your receiver is set to the correct correction source (e.g., RTK, SBAS, etc.).",
        "Still Having Issues?|If all settings appear correct and the base station is operational, please contact us for further diagnosis."
      ]
    }
  ];

  const additionalChecks = [
    {
      title: "Antenna System Check",
      icon: <CheckCircle size={20} color={colors.tint} />,
      checks: [
        "Inspect antenna for physical damage or corrosion",
        "Check antenna mounting is secure and level",
        "Verify antenna cable routing avoids sharp bends",
        "Test antenna continuity with multimeter if available"
      ]
    },
    {
      title: "System Configuration",
      icon: <Wrench size={20} color={colors.tint} />,
      checks: [
        "Verify correct GPS receiver model in software settings",
        "Check baud rate matches receiver specifications",
        "Confirm coordinate system and datum settings",
        "Verify serial port or CAN bus configuration"
      ]
    }
  ];

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



        {troubleshootingSteps.map((step, index) => (
          <View key={index}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
              <View style={styles.headerTitleRow}>
                {step.icon}
                <Text style={[styles.headerTitle, { color: colors.text }]}>{step.title}</Text>
              </View>
              <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
                {step.description}
              </Text>
            </View>
            
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Diagnostic Steps</Text>
              
              {step.steps.map((stepText, stepIndex) => {
                const [title, description] = stepText.includes('|') 
                  ? stepText.split('|') 
                  : [stepText.split(' – ')[0] || stepText.split(' - ')[0], stepText];
                
                return (
                  <View key={stepIndex} style={[styles.stepCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
                    <View style={styles.stepHeader}>
                      <View style={[styles.stepNumber, { backgroundColor: colors.tint }]}>
                        <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                      </View>
                      <Text style={[styles.stepTitle, { color: colors.text }]}>
                        {title}
                      </Text>
                    </View>
                    <Text style={[styles.stepDescription, { color: colors.textMuted }]}>
                      {description}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional System Checks</Text>
          {additionalChecks.map((check, index) => (
            <View key={index} style={[styles.checkCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
              <View style={styles.checkHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${colors.tint}15` }]}>
                  {check.icon}
                </View>
                <Text style={[styles.checkTitle, { color: colors.text }]}>{check.title}</Text>
              </View>
              <View style={styles.checkList}>
                {check.checks.map((checkText, checkIndex) => (
                  <View key={checkIndex} style={[styles.numberedCheckItem, { backgroundColor: colors.bgElevated, borderColor: colors.divider }]}>
                    <View style={[styles.checkItemNumber, { backgroundColor: colors.tint }]}>
                      <Text style={styles.checkItemNumberText}>{checkIndex + 1}</Text>
                    </View>
                    <Text style={[styles.checkItemText, { color: colors.textMuted }]}>
                      {checkText}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.photoSection, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.photoSectionTitle, { color: colors.text }]}>Send GPS Problem Photo</Text>
          <Text style={[styles.photoSectionDescription, { color: colors.textMuted }]}>
            Take photos or upload multiple images of your GPS problem to get expert help from our Ag Leader specialists.
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
              • Take clear photos of GPS displays, error messages, or wiring issues
            </Text>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Include photos of antenna placement and connections
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
          <Text style={styles.emergencyTitle}>Still No GPS Signal?</Text>
          <Text style={styles.emergencyText}>
            If you&apos;ve completed all troubleshooting steps and still have no GPS signal, contact our Ag Leader Dealer GPS specialists immediately.
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
              onPress={() => Linking.openURL("sms:0448620568?body=Ag Leader GPS - No Signal Issue: ")}
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
  section: {
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginBottom: 16,
  },

  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
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
    lineHeight: 20,
    paddingLeft: 40,
  },
  checkCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  checkHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  checkList: {
    gap: 10,
  },
  checkItem: {
    fontSize: 14,
    lineHeight: 20,
  },
  numberedCheckItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  checkItemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkItemNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold" as const,
  },
  checkItemText: {
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
    gap: 8,
  },
  photoButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
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

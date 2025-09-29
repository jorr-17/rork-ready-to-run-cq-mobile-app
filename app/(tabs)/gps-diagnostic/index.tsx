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

import { ExternalLink, MessageCircle, Phone, Navigation, Camera, Upload, Gauge, Download } from "lucide-react-native";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useTheme } from "@/constants/theme";
import GPSForm from "@/components/GPSForm";
import GPSSuccessScreen from "@/components/GPSSuccessScreen";

interface DiagnosticResource {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  type: "external" | "contact";
}





export default function GPSDiagnosticScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  
  // Always call the hook, but handle web platform differently
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const diagnosticResources: DiagnosticResource[] = [
    {
      title: "Ag Leader GPS Portal",
      description: "Official Ag Leader community support portal with GPS troubleshooting guides and firmware updates.",
      url: "https://portal.agleader.com/community/s/?language=en_US",
      icon: <ExternalLink size={24} color={colors.tint} />,
      type: "external"
    },
    {
      title: "Contact GPS Specialist",
      description: "Get direct support from our Ag Leader GPS specialists for complex troubleshooting issues.",
      url: "tel:0448620568",
      icon: <Phone size={24} color={colors.tint} />,
      type: "contact"
    },
    {
      title: "Emergency GPS Support",
      description: "24/7 emergency messaging for critical GPS system failures during field operations.",
      url: "sms:0448620568?body=Ag Leader GPS Emergency - ",
      icon: <MessageCircle size={24} color={colors.danger} />,
      type: "contact"
    }
  ];





  const handleResourcePress = (resource: DiagnosticResource) => {
    Linking.openURL(resource.url);
  };

  const handleTakePhoto = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Camera is not available on web. Please use the upload photo option.');
      return;
    }
    
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos.');
        return;
      }
    }
    setShowCamera(true);
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
      quality: 0.8,
      selectionLimit: 10, // Limit selection to 10 images
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const validAssets = result.assets.filter(asset => {
        if (!asset || !asset.uri) {
          console.warn('Invalid asset - no URI:', asset);
          return false;
        }
        
        const uri = asset.uri;
        if (uri.trim().length === 0 || uri === 'undefined' || uri === 'null') {
          console.warn('Invalid asset URI value:', uri);
          return false;
        }
        
        return true;
      });
      
      const imageUris = validAssets.map(asset => asset.uri);
      
      if (imageUris.length > 0) {
        setSelectedImages(prev => {
          const combined = [...prev, ...imageUris];
          const unique = Array.from(new Set(combined)); // Remove duplicates
          return unique.slice(0, 10); // Max 10 images total
        });
        console.log(`Added ${imageUris.length} image(s) from gallery. Total: ${Math.min(selectedImages.length + imageUris.length, 10)}`);
        
        if (selectedImages.length + imageUris.length > 10) {
          Alert.alert('Image Limit', 'Maximum 10 images allowed. Only the first 10 will be kept.');
        }
      } else {
        Alert.alert('No Valid Images', 'No valid images were found in your selection.');
      }
    }
  };

  const handleCameraCapture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        base64: false,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (!asset || !asset.uri) {
          Alert.alert('Error', 'Failed to capture image. Please try again.');
          return;
        }
        
        const newUri = asset.uri;
        if (newUri && newUri.trim().length > 0 && newUri !== 'undefined' && newUri !== 'null') {
          if (selectedImages.length >= 10) {
            Alert.alert('Image Limit', 'Maximum 10 images allowed. Please remove some images first.');
            return;
          }
          
          setSelectedImages(prev => {
            const updated = [...prev, newUri];
            return Array.from(new Set(updated)); // Remove duplicates
          });
          console.log('Camera photo captured successfully');
        } else {
          console.warn('Invalid camera URI:', newUri);
          Alert.alert('Error', 'Failed to capture image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    } finally {
      setShowCamera(false);
    }
  };

  const handleSendPhotos = () => {
    if (selectedImages.length === 0) {
      Alert.alert('No Photos', 'Please select or take at least one photo before proceeding.');
      return;
    }
    
    const validImages = selectedImages.filter(uri => {
      return uri && 
             uri.trim().length > 0 && 
             uri !== 'undefined' && 
             uri !== 'null';
    });
    
    if (validImages.length === 0) {
      Alert.alert('Invalid Photos', 'No valid photos found. Please select photos again.');
      return;
    }
    
    console.log(`Proceeding with ${validImages.length} valid photos`);
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        bounces={true}
        alwaysBounceVertical={true}
        overScrollMode="always"
        removeClippedSubviews={false}
        nestedScrollEnabled={false}
        decelerationRate="normal"
      >
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Ag Leader Dealer GPS Troubleshooting</Text>
          
          <Text style={[styles.headerText, { color: colors.textMuted }]}>
            Comprehensive troubleshooting for Ag Leader GPS systems, including InCommand 1200, InCommand GO, SteerCommand Z2, and GPS receivers.
          </Text>
        </View>

        {/* Software Update Notice */}
        <View style={[styles.updateNotice, { backgroundColor: colors.warning, margin: 20, marginBottom: 0 }]}>
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

        {/* Ag Leader Specific Tips */}
        <View style={[styles.tipsSection, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Ag Leader GPS Quick Tips</Text>
          <View style={styles.tipsList}>
            <Text style={[styles.tipItem, { color: colors.textMuted }]}>
              • InCommand displays need at least 5 satellites for RTK to work
            </Text>
            <Text style={[styles.tipItem, { color: colors.textMuted }]}>
              • Antennas should be mounted with a clear view of the sky, away from metal obstructions
            </Text>
            <Text style={[styles.tipItem, { color: colors.textMuted }]}>
              • Check NTRIP settings for RTK corrections – confirm mount point and login details
            </Text>
            <Text style={[styles.tipItem, { color: colors.textMuted }]}>
              • Make sure GGA and VTG messages are enabled at 10–20 Hz, baud rate ≥ 38,400
            </Text>
            <Text style={[styles.tipItem, { color: colors.textMuted }]}>
              • Switch to Manual Guidance – if satellites go green, issue is likely steering communication
            </Text>
            <Text style={[styles.tipItem, { color: colors.textMuted }]}>
              • Keep display and receiver firmware updated for best performance
            </Text>
          </View>
        </View>

        {/* Quick Access Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Troubleshooting</Text>
          
          <TouchableOpacity
            style={[styles.quickLinkCard, { backgroundColor: colors.card, borderColor: colors.divider }]}
            onPress={() => router.push('/gps-diagnostic/no-gps')}
            activeOpacity={0.7}
          >
            <View style={styles.quickLinkHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.tint}15` }]}>
                <Navigation size={24} color={colors.tint} />
              </View>
              <View style={styles.resourceTextContainer}>
                <Text style={[styles.resourceTitle, { color: colors.text }]}>No GPS Signal</Text>
                <Text style={[styles.resourceDescription, { color: colors.textMuted }]}>Detailed troubleshooting steps for GPS signal issues</Text>
              </View>
              <ExternalLink size={20} color={colors.textMuted} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickLinkCard, { backgroundColor: colors.card, borderColor: colors.divider }]}
            onPress={() => router.push('/gps-diagnostic/erratic-steering')}
            activeOpacity={0.7}
          >
            <View style={styles.quickLinkHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.tint}15` }]}>
                <Gauge size={24} color={colors.tint} />
              </View>
              <View style={styles.resourceTextContainer}>
                <Text style={[styles.resourceTitle, { color: colors.text }]}>Erratic Steering</Text>
                <Text style={[styles.resourceDescription, { color: colors.textMuted }]}>Troubleshoot steering issues and wheel angle sensor problems</Text>
              </View>
              <ExternalLink size={20} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        </View>



        {/* Resources Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support Resources</Text>
          <View style={styles.resourcesContainer}>
            {diagnosticResources.map((resource) => (
              <TouchableOpacity
                key={resource.title}
                style={[
                  styles.resourceCard,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.divider,
                    ...(resource.type === "contact" && { borderLeftColor: colors.warning, borderLeftWidth: 4 })
                  }
                ]}
                onPress={() => handleResourcePress(resource)}
                activeOpacity={0.7}
              >
                <View style={styles.resourceHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: `${colors.tint}15` }]}>
                    {resource.icon}
                  </View>
                  <View style={styles.resourceTextContainer}>
                    <Text style={[styles.resourceTitle, { color: colors.text }]}>
                      {resource.title}
                    </Text>
                    <Text style={[styles.resourceDescription, { color: colors.textMuted }]}>
                      {resource.description}
                    </Text>
                  </View>
                  <ExternalLink size={20} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>



        {/* Photo Upload Section */}
        <View style={[styles.photoSection, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.photoSectionTitle, { color: colors.text }]}>Send GPS Problem Photos</Text>
          <Text style={[styles.photoSectionDescription, { color: colors.textMuted }]}>
            Take photos or upload multiple images of your GPS problem to get expert help from our Ag Leader specialists.
          </Text>
          
          {selectedImages.length > 0 && (
            <TouchableOpacity
              style={[styles.proceedButton, { backgroundColor: colors.tint }]}
              onPress={handleSendPhotos}
              activeOpacity={0.8}
            >
              <Text style={styles.proceedButtonText}>Proceed with {selectedImages.length} Photo{selectedImages.length > 1 ? 's' : ''}</Text>
            </TouchableOpacity>
          )}
          
          {selectedImages.length > 0 && (
            <View style={styles.selectedPhotosContainer}>
              <Text style={[styles.selectedPhotosText, { color: colors.text }]}>
                {selectedImages.length} photo{selectedImages.length > 1 ? 's' : ''} selected
              </Text>
              <TouchableOpacity
                style={[styles.clearPhotosButton, { backgroundColor: colors.textMuted }]}
                onPress={() => setSelectedImages([])}
                activeOpacity={0.8}
              >
                <Text style={styles.clearPhotosText}>Clear All</Text>
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
                {Platform.OS === 'web' ? 'Camera N/A' : selectedImages.length > 0 ? 'Add Photo' : 'Take Photo'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.photoButton, { backgroundColor: colors.warning }]}
              onPress={handleUploadPhoto}
              activeOpacity={0.8}
            >
              <Upload size={24} color="#FFFFFF" />
              <Text style={styles.photoButtonText}>{selectedImages.length > 0 ? 'Add More' : 'Upload Photos'}</Text>
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
              • Upload multiple photos to provide complete context
            </Text>
            <Text style={[styles.photoHelpItem, { color: colors.textMuted }]}>
              • Photos will be uploaded securely and sent to our GPS specialist for quick diagnosis
            </Text>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={[styles.emergencySection, { backgroundColor: colors.danger }]}>
          <Text style={styles.emergencyTitle}>Emergency Ag Leader Dealer GPS Support</Text>
          <Text style={styles.emergencyText}>
            For critical Ag Leader GPS failures during planting, spraying, or harvest operations, contact us immediately at 0448 620 568
          </Text>
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: "rgba(255,255,255,0.2)" }]}
            onPress={() => Linking.openURL("tel:0448620568")}
          >
            <Phone size={20} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Call GPS Specialist</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Camera Modal */}
      {showCamera && Platform.OS !== 'web' && (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing="back"
          >
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                onPress={() => setShowCamera(false)}
              >
                <Text style={styles.cameraButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.captureButton, { backgroundColor: colors.tint }]}
                onPress={handleCameraCapture}
              >
                <Camera size={32} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.spacer} />
            </View>
          </CameraView>
        </View>
      )}
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
    paddingBottom: 150,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginBottom: 16,
  },
  stepsContainer: {
    gap: 16,
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
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold" as const,
  },
  stepIcon: {
    marginLeft: "auto",
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  steeringCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  steeringDescription: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  steeringSubtitle: {
    fontSize: 17,
    fontWeight: "600" as const,
    marginBottom: 12,
  },
  steeringSteps: {
    gap: 16,
  },
  steeringStep: {
    flexDirection: "row",
    gap: 12,
  },
  steeringStepNumber: {
    fontSize: 16,
    fontWeight: "bold" as const,
    width: 20,
  },
  steeringStepContent: {
    flex: 1,
    gap: 4,
  },
  steeringStepTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  steeringStepText: {
    fontSize: 14,
    lineHeight: 20,
  },
  steeringHelpText: {
    fontSize: 14,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold" as const,
    marginBottom: 8,
  },
  headerText: {
    fontSize: 15,
    lineHeight: 22,
  },
  resourcesContainer: {
    gap: 16,
  },
  resourceCard: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  resourceHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  resourceTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsSection: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
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
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.9,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  quickLinkCard: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  quickLinkHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
  cameraContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  cameraButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: 80,
    alignItems: "center",
  },
  cameraButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  updateNotice: {
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
  },
  updateText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    opacity: 0.95,
    marginBottom: 12,
  },
  updateOptions: {
    flexDirection: "row",
    alignItems: "center",
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
  bottomSpacing: {
    height: 50,
  },
  spacer: {
    width: 80,
  },
  selectedPhotosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  selectedPhotosText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  clearPhotosButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearPhotosText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  proceedButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
  },
});
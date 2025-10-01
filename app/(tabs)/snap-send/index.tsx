import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { Camera, Image as ImageIcon, X, Upload, CheckCircle, ArrowLeft, Copy, ChevronDown } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/constants/theme";
import { uploadMultipleIssueFiles } from "@/utils/firebase-upload";

interface FormData {
  fullName: string;
  phone: string;
  machine: string;
  issueDescription: string;
  issueType: string;
  images: string[];
}

const ISSUE_TYPES = [
  'Engine',
  'Hydraulics', 
  'Electrical',
  'GPS/Guidance',
  'Steering/Valve',
  'Harvester',
  'Sprayer',
  'Other'
];

interface SuccessScreenProps {
  referenceNumber: string;
  onClose: () => void;
}

interface DropdownProps {
  value: string;
  onSelect: (value: string) => void;
  options: string[];
  placeholder: string;
  colors: any;
}

function Dropdown({ value, onSelect, options, placeholder, colors }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
    Keyboard.dismiss();
  };

  const handleToggle = () => {
    Keyboard.dismiss();
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={[styles.dropdownButton, { backgroundColor: colors.card, borderColor: colors.divider }]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.dropdownButtonText, { color: value ? colors.text : colors.textMuted }]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={colors.textMuted} style={[styles.dropdownIcon, isOpen && styles.dropdownIconRotated]} />
      </TouchableOpacity>
      
      {isOpen && (
        <ScrollView 
          style={[styles.dropdownList, { backgroundColor: colors.card, borderColor: colors.divider }]}
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          bounces={true}
          removeClippedSubviews={false}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.dropdownItem, { borderBottomColor: colors.divider }]}
              onPress={() => handleSelect(option)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dropdownItemText, { color: colors.text }]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

function SuccessScreen({ referenceNumber, onClose }: SuccessScreenProps) {
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
          Thanks, your Snap & Send request has been submitted!
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

export default function SnapSendScreen() {
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    machine: "",
    issueDescription: "",
    issueType: "",
    images: [],
  });

  const pickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          `Please allow access to your ${useCamera ? "camera" : "photo library"} to continue.`
        );
        return;
      }

      const result = useCamera 
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            base64: false,
            allowsEditing: false,
            exif: false,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
            base64: false,
            allowsEditing: false,
            exif: false,
          });

      if (!result.canceled && result.assets) {
        const newImages = result.assets
          .map(asset => {
            // Ensure we have a valid URI
            const uri = asset.uri;
            if (!uri || uri.trim().length === 0 || uri === 'undefined' || uri === 'null') {
              console.warn('Invalid asset URI:', asset);
              return null;
            }
            return uri;
          })
          .filter((uri): uri is string => {
            if (!uri) return false;
            // More flexible URI validation
            const isValid = uri.startsWith('file://') || 
                           uri.startsWith('content://') || 
                           uri.startsWith('http') ||
                           uri.startsWith('data:') ||
                           uri.includes('/');
            if (!isValid) {
              console.warn('URI format not recognized:', uri.substring(0, 50));
            }
            return isValid;
          });
        
        if (newImages.length > 0) {
          setFormData(prev => {
            const combined = [...prev.images, ...newImages]
              .filter(uri => uri && uri.trim().length > 0 && uri !== 'undefined' && uri !== 'null')
              .slice(0, 10); // Max 10 images
            return {
              ...prev,
              images: combined
            };
          });
          
          console.log(`Added ${newImages.length} image(s) from camera/gallery`);
          console.log('New image URIs:', newImages);
        } else {
          console.warn('No valid images found in result.assets');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.issueDescription || !formData.issueType) {
      Alert.alert("Missing Information", "Please fill in all required fields (Full Name, Phone, Issue Type, and Issue Description).");
      return false;
    }
    return true;
  };





  const submitToFirebase = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
      const uuid = Math.random().toString(36).substring(2, 5).toUpperCase();
      const refCode = `${timestamp}-${uuid}`;
      const refNumber = refCode;
      
      // Filter valid images
      const validImages = formData.images.filter(uri => uri && uri.trim().length > 0 && uri !== 'undefined' && uri !== 'null');
      console.log('Valid images for upload:', validImages);
      
      let uploadResults: any[] = [];
      
      if (validImages.length > 0) {
        console.log(`Uploading ${validImages.length} images to Firebase...`);
        
        // Use the new upload utility
        uploadResults = await uploadMultipleIssueFiles({
          bucketFolder: "snap-send",
          refCode: refCode,
          imageUris: validImages,
          meta: {
            full_name: formData.fullName,
            phone: formData.phone,
            machine: formData.machine,
            issue_type: formData.issueType,
            issue: formData.issueDescription,
            refCode: refCode
          }
        });
        
        console.log(`Successfully uploaded ${uploadResults.length} images`);
      }

      // Create metadata object
      const metadata = {
        full_name: formData.fullName,
        phone: formData.phone,
        machine: formData.machine,
        issue: formData.issueDescription,
        issue_type: formData.issueType,
        images: uploadResults.map(result => result.downloadUrl),
        timestamp: timestamp,
        reference_number: refNumber,
        refCode: refCode,
        submitted_at: new Date().toISOString(),
      };

      console.log('Submission metadata:', metadata);
      
      // Set reference number and show success screen
      setReferenceNumber(refNumber);
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        machine: "",
        issueDescription: "",
        issueType: "",
        images: [],
      });

    } catch (error) {
      console.error('Firebase submission error:', error);
      Alert.alert(
        'Submission Failed', 
        'Failed to submit your request. Please check your internet connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setReferenceNumber("");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (showSuccess) {
    return <SuccessScreen referenceNumber={referenceNumber} onClose={handleSuccessClose} />;
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.bgElevated }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          bounces={true}
          removeClippedSubviews={false}
          nestedScrollEnabled={true}
        >
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Snap & Send</Text>
          <Text style={[styles.headerText, { color: colors.textMuted }]}>
            Snap a photo of your mechanical issue and our expert technicians will diagnose the problem and provide solutions within 24 hours.
          </Text>
        </View>

        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, textAlign: "center" }]}>Upload Photos</Text>
          <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
            Add up to 10 photos showing the mechanical problem or issue
          </Text>
          
          <View style={styles.imageGrid}>
            {formData.images
              .filter(uri => uri && uri.trim().length > 0 && uri !== 'undefined' && uri !== 'null')
              .map((uri, index) => {
                // Create a safe key using index and timestamp
                const safeKey = `image-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                return (
                  <View key={safeKey} style={styles.imageContainer}>
                    <Image 
                      source={{ uri: uri }} 
                      style={styles.uploadedImage}
                      onError={(error) => {
                        console.warn('Image load error for URI:', uri?.substring(0, 50) + '...', error.nativeEvent?.error);
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', uri?.substring(0, 50) + '...');
                      }}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            
            {formData.images.filter(uri => uri && uri.trim().length > 0 && uri !== 'undefined' && uri !== 'null').length < 10 && (
              <>
                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.divider }]}
                  onPress={() => pickImage(true)}
                >
                  <Camera size={32} color={colors.tint} />
                  <Text style={[styles.uploadButtonText, { color: colors.tint, textAlign: "center" }]}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.divider }]}
                  onPress={() => pickImage(false)}
                >
                  <ImageIcon size={32} color={colors.tint} />
                  <Text style={[styles.uploadButtonText, { color: colors.tint }]}>Choose Photo</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Request Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Full Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.divider }]}
              value={formData.fullName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
              placeholder="John Smith"
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
              onSubmitEditing={dismissKeyboard}
              blurOnSubmit={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Phone *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.divider }]}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="0400 000 000"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={dismissKeyboard}
              blurOnSubmit={true}
            />
          </View>



          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Machine</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.divider }]}
              value={formData.machine}
              onChangeText={(text) => setFormData(prev => ({ ...prev, machine: text }))}
              placeholder="e.g., John Deere 8R, Case IH Magnum, Kubota M7"
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
              onSubmitEditing={dismissKeyboard}
              blurOnSubmit={true}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Issue Type *</Text>
            <Dropdown
              value={formData.issueType}
              onSelect={(value) => setFormData(prev => ({ ...prev, issueType: value }))}
              options={ISSUE_TYPES}
              placeholder="Select issue type"
              colors={colors}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Issue Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.divider }]}
              value={formData.issueDescription}
              onChangeText={(text) => setFormData(prev => ({ ...prev, issueDescription: text }))}
              placeholder="Describe the mechanical issue, symptoms, any unusual noises, when the problem occurs, error codes displayed, and any recent maintenance or repairs..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              returnKeyType="done"
              onSubmitEditing={dismissKeyboard}
              blurOnSubmit={true}
            />
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton, 
              { 
                backgroundColor: colors.tint,
                opacity: isSubmitting ? 0.6 : 1
              }
            ]}
            onPress={submitToFirebase}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            <Upload size={20} color="#FFFFFF" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {formData.images.filter(uri => uri && uri.trim().length > 0 && uri !== 'undefined' && uri !== 'null').length > 0 && (
          <Text style={[styles.imageNote, { color: colors.textMuted }]}>
            📎 {formData.images.filter(uri => uri && uri.trim().length > 0 && uri !== 'undefined' && uri !== 'null').length} image(s) selected - will be uploaded to Firebase Storage
          </Text>
        )}

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          * We aim to respond within 24 hours during business days
        </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    marginBottom: 4,
    textAlign: "center",
  },
  sectionHint: {
    fontSize: 14,
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButtonText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600" as const,
    textAlign: "center",
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 100,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  submitContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  submitButton: {
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
  },
  imageNote: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  disclaimer: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
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
  dropdownContainer: {
    position: "relative",
  },
  dropdownButton: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownButtonText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  dropdownIconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
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
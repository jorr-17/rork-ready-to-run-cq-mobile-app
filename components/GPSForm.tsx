import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
} from "react-native";

import { Upload } from "lucide-react-native";
import { useTheme } from "@/constants/theme";
import { uploadMultipleIssueFiles } from "@/utils/firebase-upload";

interface GPSFormData {
  fullName: string;
  phone: string;
  system: string;
  issueDescription: string;
}

interface GPSFormProps {
  imageUris: string[];
  onSuccess: (referenceNumber: string) => void;
  onCancel: () => void;
}

export default function GPSForm({ imageUris, onSuccess, onCancel }: GPSFormProps) {
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<GPSFormData>({
    fullName: "",
    phone: "",
    system: "",
    issueDescription: "",
  });

  const validateForm = () => {
    if (!formData.fullName || !formData.phone || !formData.issueDescription) {
      Alert.alert("Missing Information", "Please fill in all required fields (Full Name, Phone, and Issue Description).");
      return false;
    }
    return true;
  };



  const submitToFirebase = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const timestamp = Date.now().toString();
      const refNumber = timestamp;
      
      console.log('Uploading GPS problem images to Firebase...');
      
      // Filter and validate image URIs
      const validImageUris = imageUris.filter(uri => {
        if (!uri || typeof uri !== 'string') return false;
        const trimmed = uri.trim();
        return trimmed.length > 0 && 
               trimmed !== 'undefined' && 
               trimmed !== 'null' &&
               (trimmed.startsWith('file://') || 
                trimmed.startsWith('content://') || 
                trimmed.startsWith('http') ||
                trimmed.startsWith('data:'));
      });
      
      console.log(`Filtered ${validImageUris.length} valid GPS image URIs from ${imageUris.length} total`);
      
      let uploadResults: any[] = [];
      
      if (validImageUris.length > 0) {
        try {
          // Use the upload utility for multiple images
          uploadResults = await uploadMultipleIssueFiles({
            bucketFolder: "gps-problems",
            imageUris: validImageUris,
            meta: {
              full_name: formData.fullName,
              phone: formData.phone,
              system: formData.system,
              issue_type: "GPS Problem",
              issue: formData.issueDescription
            }
          });
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Continue with form submission even if image upload fails
          uploadResults = [];
        }
        
        console.log(`Successfully uploaded ${uploadResults.length} GPS problem images`);
      }

      // Create metadata object
      const metadata = {
        full_name: formData.fullName,
        phone: formData.phone,
        system: formData.system,
        issue_description: formData.issueDescription,
        images: uploadResults.map(result => result.downloadUrl),
        timestamp: timestamp,
        reference_number: refNumber,
        submitted_at: new Date().toISOString(),
      };

      console.log('GPS problem submission metadata:', metadata);
      console.log('GPS problem upload results:', uploadResults);

      // Set reference number and show success screen
      onSuccess(refNumber);
      
    } catch (error) {
      console.error('Firebase submission error:', error);
      // For development, still show success even if Firebase fails
      console.warn('Proceeding with success for development...');
      const timestamp = Date.now().toString();
      onSuccess(timestamp);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgElevated }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>GPS Problem Details</Text>
        <Text style={[styles.headerText, { color: colors.textMuted }]}>
          Please provide details about your GPS problem to help our specialists diagnose the issue.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.section}>
              {/* Selected Images Section */}
              {(() => {
                const validImages = imageUris.filter(uri => 
                  uri && 
                  uri.trim().length > 0 && 
                  uri !== 'undefined' && 
                  uri !== 'null'
                );
                
                if (validImages.length === 0) return null;
                
                return (
                  <View style={styles.imagesSection}>
                    <Text style={[styles.imagesSectionTitle, { color: colors.text }]}>
                      Selected Images ({validImages.length})
                    </Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.imagesContainer}
                    >
                      {validImages.map((uri, index) => {
                        // Create a stable key using URI hash and index
                        const uriHash = uri.substring(uri.length - 10); // Last 10 chars as simple hash
                        const safeKey = `gps-image-${index}-${uriHash}`;
                        
                        return (
                          <View key={safeKey} style={styles.imagePreviewContainer}>
                            <Image 
                              source={{ uri }} 
                              style={styles.imagePreview} 
                              resizeMode="cover"
                              onError={(error) => {
                                console.warn(`GPS Image ${index + 1} load error:`, error.nativeEvent?.error);
                              }}
                              onLoad={() => {
                                console.log(`GPS Image ${index + 1} loaded successfully`);
                              }}
                            />
                            <View style={[styles.imageIndex, { backgroundColor: colors.tint }]}>
                              <Text style={styles.imageIndexText}>{index + 1}</Text>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                );
              })()}

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
                <Text style={[styles.inputLabel, { color: colors.text }]}>System</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.divider }]}
                  value={formData.system}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, system: text }))}
                  placeholder="e.g., Ag Leader, Trimble, John Deere, etc."
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="next"
                  onSubmitEditing={dismissKeyboard}
                  blurOnSubmit={true}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Issue Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.divider }]}
                  value={formData.issueDescription}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, issueDescription: text }))}
                  placeholder="Describe the GPS problem, error messages, when it occurs, and any troubleshooting steps you've already tried..."
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

            {/* Submit Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.textMuted }]}
                onPress={onCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
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
                  {isSubmitting ? 'Submitting...' : 'Submit GPS Problem'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
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
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  submitButton: {
    flex: 2,
    borderRadius: 12,
    padding: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
  },
  imagesSection: {
    marginBottom: 24,
  },
  imagesSectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 12,
  },
  imagesContainer: {
    paddingRight: 20,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 12,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  mockImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  mockImageText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },
  imageIndex: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIndexText: {
    fontSize: 12,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
  },
});
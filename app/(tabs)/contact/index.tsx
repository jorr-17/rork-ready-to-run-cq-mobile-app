import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,

} from "react-native";

import { Phone, Mail, Clock, MessageSquare, Facebook, Globe } from "lucide-react-native";
import { useTheme } from "@/constants/theme";

export default function ContactScreen() {
  const { colors } = useTheme();
  
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Mobile",
      subtitle: "0448 620 568",
      action: () => Linking.openURL("tel:0448620568"),
      color: colors.success,
    },
    {
      icon: Mail,
      title: "Email Us",
      subtitle: "admin@readytoruncq.com.au",
      action: () => Linking.openURL("mailto:admin@readytoruncq.com.au"),
      color: colors.tint,
    },
    {
      icon: MessageSquare,
      title: "Send Enquiry",
      subtitle: "Via our website",
      action: () => Linking.openURL("https://www.readytoruncq.com.au/contact"),
      color: colors.warning,
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.bgElevated }]}
      showsVerticalScrollIndicator={false}
    >
        {/* Header Section */}
        <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.divider }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Get in Touch</Text>
          <Text style={[styles.headerText, { color: colors.textMuted }]}>
            We&apos;re here to help with all your agricultural needs. Choose your preferred way to contact us.
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.methodsContainer}>
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.contactCard, { backgroundColor: colors.card }]}
                onPress={method.action}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: method.color }]}>
                  <Icon size={28} color="#FFFFFF" />
                </View>
                <View style={styles.contactContent}>
                  <Text style={[styles.contactTitle, { color: colors.text }]}>{method.title}</Text>
                  <Text style={[styles.contactSubtitle, { color: colors.textMuted }]}>{method.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Business Hours */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <View style={styles.infoHeader}>
            <Clock size={24} color={colors.tint} />
            <Text style={[styles.infoTitle, { color: colors.text }]}>Business Hours</Text>
          </View>
          <View style={styles.hoursContainer}>
            <View style={styles.hoursRow}>
              <Text style={[styles.hoursDay, { color: colors.text }]}>Monday - Friday</Text>
              <Text style={[styles.hoursTime, { color: colors.textMuted }]}>8:00 AM - 5:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={[styles.hoursDay, { color: colors.text }]}>Saturday - Sunday</Text>
              <Text style={[styles.hoursTime, { color: colors.textMuted }]}>Closed</Text>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={[styles.emergencyCard, { backgroundColor: colors.danger }]}>
          <Text style={styles.emergencyTitle}>24/7 Emergency Messaging</Text>
          <Text style={styles.emergencyText}>
            For urgent agricultural emergencies outside business hours, send us a message anytime
          </Text>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => Linking.openURL("sms:0448620568?body=URGENT%20-%20Emergency%20Request:%20")}
          >
            <MessageSquare size={20} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Send Emergency SMS</Text>
          </TouchableOpacity>
        </View>

        {/* Website */}
        <TouchableOpacity
          style={[styles.websiteCard, { backgroundColor: colors.card }]}
          onPress={() => Linking.openURL("https://www.readytoruncq.com.au")}
        >
          <Globe size={24} color={colors.tint} />
          <View style={styles.websiteContent}>
            <Text style={[styles.websiteTitle, { color: colors.text }]}>Visit Our Website</Text>
            <Text style={[styles.websiteUrl, { color: colors.tint }]}>www.readytoruncq.com.au</Text>
          </View>
        </TouchableOpacity>

        {/* Facebook Page */}
        <TouchableOpacity
          style={[styles.websiteCard, { backgroundColor: colors.card }]}
          onPress={() => Linking.openURL("https://www.facebook.com/readytoruncq")}
        >
          <Facebook size={24} color={colors.tint} />
          <View style={styles.websiteContent}>
            <Text style={[styles.websiteTitle, { color: colors.text }]}>Visit Our Facebook Page</Text>
            <Text style={[styles.websiteUrl, { color: colors.tint }]}>Follow us for updates</Text>
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Ready to Run CQ - Your trusted partner in Central Queensland agriculture
          </Text>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  methodsContainer: {
    padding: 20,
    gap: 12,
  },
  contactCard: {
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  contactSubtitle: {
    fontSize: 15,
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginLeft: 12,
  },
  hoursContainer: {
    gap: 12,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  hoursDay: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
  hoursTime: {
    fontSize: 15,
  },
  emergencyCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.95,
  },
  emergencyButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
  websiteCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  websiteContent: {
    marginLeft: 16,
    flex: 1,
  },
  websiteTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  websiteUrl: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
});
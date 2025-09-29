import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/constants/theme";
import { ThemeSettings } from "@/components/ThemeSettings";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Smartphone, 
  Info, 
 
  MessageSquare, 
  Phone,
  Shield,

  Wrench
} from "lucide-react-native";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    Alert.alert(
      "Notifications",
      notificationsEnabled ? "Notifications disabled" : "Notifications enabled"
    );
  };





  const handleContactSupport = () => {
    Linking.openURL("https://www.readytoruncq.com.au/contact");
  };

  const settingSections = [
    {
      title: "Preferences",
      items: [
        {
          icon: <Bell size={20} color={colors.tint} />,
          title: "Notifications",
          subtitle: "Receive alerts and updates",
          type: "toggle" as const,
          value: notificationsEnabled,
          onToggle: handleNotificationToggle
        }
      ]
    },
    {
      title: "App Information",
      items: [
        {
          icon: <Smartphone size={20} color={colors.tint} />,
          title: "App Version",
          subtitle: "v2.5.0",
          type: "info" as const
        },
        {
          icon: <Info size={20} color={colors.tint} />,
          title: "About This App",
          subtitle: "Machinery maintenance & troubleshooting tools",
          type: "info" as const
        },
        {
          icon: <Wrench size={20} color={colors.tint} />,
          title: "Developed By",
          subtitle: "Ready to Run Machinery Maintenance",
          type: "info" as const
        }
      ]
    },
    {
      title: "Support & Help",
      items: [

        {
          icon: <MessageSquare size={20} color={colors.tint} />,
          title: "Contact Support",
          subtitle: "Get help from our machinery specialists",
          type: "action" as const,
          onPress: handleContactSupport
        },
        {
          icon: <Phone size={20} color={colors.tint} />,
          title: "Emergency Support",
          subtitle: "Call: 0448 620 568",
          type: "action" as const,
          onPress: () => Linking.openURL("tel:0448620568")
        }
      ]
    },
    {
      title: "Privacy & Data",
      items: [
        {
          icon: <Shield size={20} color={colors.tint} />,
          title: "Privacy Policy",
          subtitle: "How we protect your data",
          type: "action" as const,
          onPress: () => Linking.openURL("https://www.readytoruncq.com.au/privacy")
        }
      ]
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bgElevated }]}>
      <Stack.Screen 
        options={{ 
          title: "Settings",
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" }
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={[styles.headerIconContainer, { backgroundColor: colors.tint + '15' }]}>
            <SettingsIcon size={32} color={colors.tint} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>App Settings</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            Customize your machinery maintenance & diagnostic tools
          </Text>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <ThemeSettings style={{ marginHorizontal: 20 }} />
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            
            <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <TouchableOpacity
                    style={[
                      styles.settingItem,
                      itemIndex < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }
                    ]}
                    onPress={item.type === 'action' ? item.onPress : undefined}
                    disabled={item.type !== 'action'}
                    activeOpacity={item.type === 'action' ? 0.7 : 1}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIconContainer, { backgroundColor: colors.tint + '10' }]}>
                        {item.icon}
                      </View>
                      <View style={styles.settingTextContainer}>
                        <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
                        <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>{item.subtitle}</Text>
                      </View>
                    </View>
                    
                    {item.type === 'toggle' && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: colors.divider, true: colors.tint + '40' }}
                        thumbColor={item.value ? colors.tint : colors.textMuted}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Ready to Run Machinery Maintenance
          </Text>
          <Text style={[styles.footerText, { color: colors.textMuted }]}>
            Professional diagnostic & troubleshooting tools
          </Text>
          <Text style={[styles.footerText, { color: colors.textMuted, marginTop: 8 }]}>
            Made with ❤️ for Central Queensland farmers
          </Text>
        </View>
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
  content: {
    paddingBottom: 30,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold" as const,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
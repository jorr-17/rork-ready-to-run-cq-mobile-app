import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/constants/theme";
import { aboutData, suppliersData } from "@/data/services";
import { Award, Calendar, Users, Building2, ExternalLink } from "lucide-react-native";

export default function AboutScreen() {
  const { colors } = useTheme();
  const [pressedCard, setPressedCard] = useState<string | null>(null);

  const handlePressIn = (id: string) => {
    setPressedCard(id);
  };

  const handlePressOut = () => {
    setPressedCard(null);
  };

  const handlePress = (website?: string) => {
    if (website) {
      Linking.openURL(website);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <Stack.Screen 
        options={{ 
          title: "About Us",
          headerStyle: { backgroundColor: colors.bgElevated },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" }
        }} 
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Overview */}
        <View style={[styles.card, { backgroundColor: colors.bgElevated }]}>
          <View style={styles.iconRow}>
            <Award size={28} color={colors.tint} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Our Story</Text>
          </View>
          <Text style={[styles.cardText, { color: colors.textMuted }]}>
            {aboutData.overview}
          </Text>
        </View>

        {/* Key Facts */}
        <View style={styles.factsContainer}>
          <View style={[styles.factCard, { backgroundColor: colors.bgElevated }]}>
            <Calendar size={24} color={colors.tint} />
            <Text style={[styles.factNumber, { color: colors.text }]}>2011</Text>
            <Text style={[styles.factLabel, { color: colors.textMuted }]}>Founded</Text>
          </View>
          <View style={[styles.factCard, { backgroundColor: colors.bgElevated }]}>
            <Users size={24} color={colors.tint} />
            <Text style={[styles.factNumber, { color: colors.text }]}>40+</Text>
            <Text style={[styles.factLabel, { color: colors.textMuted }]}>Years Experience</Text>
          </View>
        </View>

        {/* Specializations */}
        <View style={[styles.card, { backgroundColor: colors.bgElevated }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Our Specializations</Text>
          <View style={styles.specializationList}>
            {[
              "Tractors",
              "Harvesters",
              "Cultivators",
              "Sprayers",
              "Precision Agriculture",
              "Self-Steer Systems",
              "Spatial Management"
            ].map((item, index) => (
              <View key={index} style={styles.specializationItem}>
                <View style={[styles.bullet, { backgroundColor: colors.tint }]} />
                <Text style={[styles.specializationText, { color: colors.text }]}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View style={[styles.card, { backgroundColor: colors.bgElevated }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Our Team</Text>
          {aboutData.team.map((member) => (
            <View key={member.id} style={styles.teamMember}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.bg }]}>
                <Text style={[styles.avatarInitials, { color: colors.tint }]}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                <Text style={[styles.memberRole, { color: colors.tint }]}>{member.role}</Text>
                <Text style={[styles.memberBio, { color: colors.textMuted }]}>{member.bio}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Suppliers Section */}
        <View style={[styles.card, { backgroundColor: colors.bgElevated }]}>
          <View style={styles.iconRow}>
            <Building2 size={28} color={colors.tint} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Our Trusted Partners</Text>
          </View>
          <Text style={[styles.cardText, { color: colors.textMuted }]}>
            We work with industry-leading suppliers to deliver quality agricultural solutions.
          </Text>
          
          <View style={styles.suppliersGrid}>
            {suppliersData.map((supplier) => (
              <TouchableOpacity 
                key={supplier.id} 
                style={[
                  styles.supplierCard, 
                  { 
                    backgroundColor: colors.bg, 
                    borderColor: pressedCard === supplier.id ? colors.tint : colors.divider,
                    borderWidth: pressedCard === supplier.id ? 2 : 1,
                    transform: [{ scale: pressedCard === supplier.id ? 0.98 : 1 }]
                  }
                ]}
                onPress={() => handlePress(supplier.website)}
                onPressIn={() => handlePressIn(supplier.id)}
                onPressOut={handlePressOut}
                activeOpacity={1}
              >
                <View style={styles.supplierInfo}>
                  <View style={styles.supplierHeader}>
                    <Text style={[styles.supplierName, { color: colors.text }]} numberOfLines={1}>
                      {supplier.name}
                    </Text>
                    {supplier.website && (
                      <View style={[styles.linkBadge, { backgroundColor: colors.tint + '15' }]}>
                        <ExternalLink size={12} color={colors.tint} />
                      </View>
                    )}
                  </View>
                  
                  <Text style={[styles.supplierDescription, { color: colors.textMuted }]} numberOfLines={2}>
                    {supplier.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Values */}
        <View style={[styles.card, { backgroundColor: colors.tint }]}>
          <Text style={styles.valuesTitle}>Our Commitment</Text>
          <Text style={styles.valuesText}>
            Family-owned and operated, we&apos;re committed to providing personalized service and building long-term relationships with Central Queensland farmers. Your success is our priority.
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
    paddingVertical: 20,
  },
  card: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    marginLeft: 12,
  },
  cardText: {
    fontSize: 15,
    lineHeight: 22,
  },
  factsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  factCard: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  factNumber: {
    fontSize: 24,
    fontWeight: "bold" as const,
    marginTop: 8,
  },
  factLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  specializationList: {
    marginTop: 12,
  },
  specializationItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  specializationText: {
    fontSize: 15,
  },
  teamMember: {
    flexDirection: "row",
    marginTop: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: "bold" as const,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  memberRole: {
    fontSize: 14,
    marginTop: 2,
    marginBottom: 6,
  },
  memberBio: {
    fontSize: 14,
    lineHeight: 20,
  },
  valuesTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  valuesText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#FFFFFF",
  },
  suppliersGrid: {
    marginTop: 16,
    gap: 12,
  },
  supplierCard: {
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  supplierName: {
    fontSize: 14,
    fontWeight: "600" as const,
    flex: 1,
  },
  linkBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  supplierDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});
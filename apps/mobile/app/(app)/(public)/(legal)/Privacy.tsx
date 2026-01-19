import React, { useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// List of sections for the Table of Contents
const SECTIONS = [
  { id: "intro", title: "Introduction" },
  { id: "collect", title: "Information We Collect" },
  { id: "usage", title: "Usage" },
  { id: "security", title: "Security" },
  { id: "retention", title: "Retention" },
  { id: "contact", title: "Contact" },
];

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<{ [key: string]: number }>({});

  // Function to handle smooth scrolling to a section
  const scrollToSection = (id: string) => {
    const y = sectionPositions.current[id];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: y - 20, animated: true });
    }
  };

  const handleContact = (type: "email" | "phone") => {
    const url =
      type === "email" ? "mailto:disrupt@4th-pay.com" : "tel:+233554506861";
    Linking.openURL(url);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Sticky Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white border-b border-slate-100"
      >
        <View className="flex-row items-center px-6 pb-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={26} color="#0f172a" />
          </TouchableOpacity>
          <Text className="text-xl font-black text-slate-900 ml-2">Back</Text>
        </View>

        {/* Table of Contents Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-3 px-4"
          contentContainerStyle={{ paddingRight: 40 }}
        >
          {SECTIONS.map((sec) => (
            <TouchableOpacity
              key={sec.id}
              onPress={() => scrollToSection(sec.id)}
              className="bg-slate-100 px-4 py-2 rounded-full mr-2 border border-slate-200"
            >
              <Text className="text-slate-700 font-bold text-xs">
                {sec.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        className="px-6 pt-6"
      >
        {/* Intro Branding */}
        <View className="mb-10">
          <Text className="text-3xl font-black text-slate-900 leading-tight">
            4 Our Life{"\n"}
            <Text className="text-green-600">Privacy Policy</Text>
          </Text>
          <Text className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-[2px]">
            Last Updated: Jan 2026
          </Text>
        </View>

        {/* SECTION 1 */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["intro"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            1. Introduction
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 text-base font-medium">
              4 Our Life is committed to protecting your privacy and ensuring
              the security of your personal information, particularly your
              health data. This policy complies with the Data Protection Act,
              2012 (Act 843) of Ghana.
            </Text>
          </View>
        </View>

        {/* SECTION 2 */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["collect"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            2. Information We Collect
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 font-medium mb-2">
              • Identity: Name, email, phone number.
            </Text>
            <Text className="text-slate-600 leading-6 font-medium mb-2">
              • Health: Profile info, medication history, symptoms, and facility
              interactions.
            </Text>
            <Text className="text-slate-600 leading-6 font-medium">
              • Device: Location, usage data, and automated tech logs.
            </Text>
          </View>
        </View>

        {/* SECTION 3 */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["usage"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            3. How We Use Information
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 font-medium mb-2">
              5.1 Provide and improve the App.
            </Text>
            <Text className="text-slate-600 leading-6 font-medium mb-2">
              5.2 Support health features like ovulation tracking and medication
              reminders.
            </Text>
            <Text className="text-slate-600 leading-6 font-medium">
              5.3 Conduct research, analytics, and marketing.
            </Text>
          </View>
        </View>

        {/* SECTION 4 */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["security"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            4. Data Security
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 font-medium">
              We use encryption in transit and at rest, MFA, and strict access
              controls. Health data receives enhanced encryption and audited
              access. Breach notifications are sent within 72 hours.
            </Text>
          </View>
        </View>

        {/* SECTION 5 */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["retention"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            5. Data Retention
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 font-medium mb-2">
              Account: Life of account + 2 years.
            </Text>
            <Text className="text-slate-600 leading-6 font-medium mb-2">
              Health Data: Life of account + 3 years.
            </Text>
            <Text className="text-slate-600 leading-6 font-medium">
              Marketing: Until opt-out.
            </Text>
          </View>
        </View>

        {/* SECTION 6: CONTACT */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["contact"] = e.nativeEvent.layout.y)
          }
        >
          <View className="bg-green-600 p-8 rounded-[40px] mb-8 shadow-xl shadow-green-200">
            <Text className="text-white text-2xl font-black mb-2">
              Contact Us
            </Text>
            <Text className="text-green-50 font-medium mb-6 leading-5">
              4th Pay Ltd {"\n"}
              Kwashieman Ofankor Road, Accra, Ghana
            </Text>

            <View className="flex-row gap-x-2">
              <TouchableOpacity
                onPress={() => handleContact("email")}
                className="flex-1 bg-white p-4 rounded-2xl flex-row items-center justify-center"
              >
                <Ionicons name="mail" size={20} color="#16a34a" />
                <Text className="text-green-700 font-bold ml-2">Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleContact("phone")}
                className="flex-1 bg-emerald-500 p-4 rounded-2xl flex-row items-center justify-center"
              >
                <Ionicons name="call" size={20} color="white" />
                <Text className="text-white font-bold ml-2">Call</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="items-center pb-10">
          <Text className="text-slate-300 text-[10px] font-black uppercase tracking-[3px]">
            4 Our Life Limited • Ghana
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

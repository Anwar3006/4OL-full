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

const TERMS_SECTIONS = [
  { id: "agreement", title: "The Agreement" },
  { id: "eligibility", title: "Eligibility" },
  { id: "medical", title: "Medical Disclaimer" },
  { id: "conduct", title: "User Conduct" },
  { id: "liability", title: "Liability" },
  { id: "termination", title: "Termination" },
];

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<{ [key: string]: number }>({});

  const scrollToSection = (id: string) => {
    const y = sectionPositions.current[id];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: y - 20, animated: true });
    }
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

        {/* Table of Contents */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-3 px-4"
        >
          {TERMS_SECTIONS.map((sec) => (
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
        <View className="mb-10">
          <Text className="text-3xl font-black text-slate-900 leading-tight">
            Terms &{"\n"}
            <Text className="text-green-600">Conditions</Text>
          </Text>
          <Text className="text-slate-400 mt-2 font-bold text-xs uppercase tracking-[2px]">
            Version 1.0 • Jan 2026
          </Text>
        </View>

        {/* 1. Agreement */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["agreement"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            1. The Agreement
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 text-base font-medium">
              By accessing or using the 4 Our Life App, you agree to be bound by
              these Terms. If you do not agree to all of these terms, do not use
              the service.
            </Text>
          </View>
        </View>

        {/* 2. Eligibility */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["eligibility"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            2. Eligibility
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 font-medium">
              You must be at least 13 years old to use this App. Users between
              13–18 require guardian consent to access specific health features.
            </Text>
          </View>
        </View>

        {/* 3. Medical Disclaimer - CRITICAL FOR HEALTH APPS */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["medical"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-red-600 mb-3 uppercase tracking-wider">
            3. Medical Disclaimer
          </Text>
          <View className="bg-red-50/50 p-5 rounded-3xl border border-red-100 mb-8">
            <Text className="text-slate-700 leading-6 font-bold mb-2 italic">
              IMPORTANT: 4 Our Life is an information tool, NOT a medical
              provider.
            </Text>
            <Text className="text-slate-600 leading-6 font-medium">
              The App provides facility finders and health tracking but does not
              provide clinical diagnoses. Always seek the advice of a qualified
              healthcare provider in Ghana for medical conditions.
            </Text>
          </View>
        </View>

        {/* 4. User Conduct */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["conduct"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            4. User Conduct
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 font-medium">
              You agree not to: {"\n"}• Provide false health information. {"\n"}
              • Attempt to breach security protocols. {"\n"}• Reverse engineer
              the App.
            </Text>
          </View>
        </View>

        {/* 5. Limitation of Liability */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["liability"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            5. Liability
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 font-medium">
              4 Our Life Limited (4th Pay Ltd) shall not be liable for any
              indirect, incidental, or consequential damages resulting from your
              use of the App.
            </Text>
          </View>
        </View>

        {/* 6. Termination */}
        <View
          onLayout={(e) =>
            (sectionPositions.current["termination"] = e.nativeEvent.layout.y)
          }
        >
          <Text className="text-lg font-black text-slate-900 mb-3 uppercase tracking-wider">
            6. Termination
          </Text>
          <View className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 mb-8">
            <Text className="text-slate-600 leading-6 font-medium">
              We reserve the right to terminate or suspend your account at our
              sole discretion, without notice, for conduct that we believe
              violates these Terms.
            </Text>
          </View>
        </View>

        <View className="bg-slate-900 p-8 rounded-[40px] mb-10">
          <Text className="text-white text-xl font-black mb-4">
            Contact Legal
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:disrupt@4th-pay.com")}
            className="bg-green-500 p-4 rounded-2xl items-center"
          >
            <Text className="text-white font-bold">Email Legal Team</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

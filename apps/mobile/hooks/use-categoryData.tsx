import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image, useWindowDimensions } from "react-native";

type CategoryItem = {
  id: string;
  icon: any;
  title: string;
  screen: string;
};
export const useCategoryData = () => {
  const { width } = useWindowDimensions();

  // Base scale calculation: Adjust these numbers to fit your design
  // This grows the icons slightly on larger screens without over-scaling
  const scale = width > 600 ? 1.2 : 1;
  const getSize = (base: number) => base * scale;

  const categories: CategoryItem[] = [
    {
      id: "1",
      icon: <FontAwesome6 name="hospital" size={30} color="green" />,
      title: "Hospitals",
      screen: "TopRated",
    },
    {
      id: "2",
      icon: (
        <Image
          source={require("@/assets/images/pharmacyIcon.png")}
          resizeMode="contain"
          style={{
            width: getSize(40),
            height: getSize(33),
            tintColor: "green",
          }}
        />
      ),
      title: "Pharmacies",
      screen: "TopRated",
    },
    {
      id: "3",
      icon: (
        <Image
          source={require("@/assets/images/diseaseIcon.png")}
          resizeMode="contain"
          style={{
            width: getSize(40),
            height: getSize(33),
            tintColor: "green",
          }}
        />
      ),
      title: "Diseases",
      screen: "Diseases",
    },
    {
      id: "4",
      icon: (
        <Image
          source={require("@/assets/images/bloodIcon.png")}
          resizeMode="contain"
          style={{
            width: getSize(40),
            height: getSize(33),
            tintColor: "green",
          }}
        />
      ),
      title: "Plasence",
      screen: "PeriodsTracker",
    },
    {
      id: "5",
      icon: <FontAwesome6 name="flask" size={getSize(22)} color={"green"} />,
      title: "Diagnostic Lab",
      screen: "TopRated",
    },
    {
      id: "6",
      icon: <FontAwesome6 name="ribbon" size={getSize(26)} color={"green"} />,
      title: "Symptoms",
      screen: "Symptoms",
    },
    {
      id: "7",
      icon: (
        <Ionicons name="fitness-outline" size={getSize(30)} color={"green"} />
      ),
      title: "Healthy Living",
      screen: "TopRated",
    },
    {
      id: "8",
      icon: (
        <Image
          source={require("@/assets/images/herbalIcon.png")}
          resizeMode="contain"
          style={{
            width: getSize(43),
            height: getSize(26),
            tintColor: "green",
          }}
        />
      ),
      title: "Herbal Hospital",
      screen: "TopRated",
    },
    {
      id: "9",
      icon: (
        <FontAwesome6 name="truck-medical" size={getSize(24)} color={"green"} />
      ),
      title: "Ambulance",
      screen: "TopRated",
    },
    {
      id: "10",
      icon: (
        <MaterialCommunityIcons
          name="shield-home-outline"
          size={getSize(30)}
          color={"green"}
        />
      ),
      title: "Homes",
      screen: "TopRated",
    },
    {
      id: "11",
      icon: (
        <Image
          source={require("@/assets/images/physiotherapyIcon.png")}
          style={{
            width: getSize(40),
            height: getSize(40),
            tintColor: "green",
          }}
        />
      ),
      title: "Physiotherapy",
      screen: "TopRated",
    },
    {
      id: "12",
      icon: (
        <Image
          source={require("@/assets/images/eyeCareIcon.png")}
          style={{
            width: getSize(30),
            height: getSize(30),
            tintColor: "green",
          }}
        />
      ),
      title: "Eye Care",
      screen: "TopRated",
    },
    {
      id: "13",
      icon: (
        <Image
          source={require("@/assets/images/dentalIcon.png")}
          style={{ width: 30, height: 31, tintColor: "green" }}
        />
      ),
      title: "Dental",
      screen: "TopRated",
    },
    {
      id: "14",
      icon: (
        <Image
          source={require("@/assets/images/osteopathyIcon.png")}
          style={{
            width: getSize(30),
            height: getSize(30),
            tintColor: "green",
          }}
        />
      ),
      title: "Osteopathy (Joints/ Muscles)",
      screen: "TopRated",
    },
    {
      id: "15",
      icon: (
        <Image
          source={require("@/assets/images/prostheticIcon.png")}
          style={{ width: 50, height: 40, tintColor: "green" }}
        />
      ),
      title: "Prosthetics",
      screen: "TopRated",
    },
    {
      id: "16",
      icon: <MaterialIcons name="accessible" size={40} color={"green"} />,
      title: "Disability",
      screen: "TopRated",
    },
    {
      id: "17",
      icon: (
        <Image
          source={require("@/assets/images/mentalHealthIcon.png")}
          style={{ width: 40, height: 40, tintColor: "green" }}
        />
      ),
      title: "Psychiatric",
      screen: "TopRated",
    },
  ];

  return { categories, width };
};

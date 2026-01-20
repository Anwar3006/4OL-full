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
  value: string;
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
      value: "hospitals_&_clinics",
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
      value: "pharmacies",
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
      value: "diseases", //change
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
      value: "plasence", //change: should navigate to Plasence not fetch facilities
      screen: "PeriodsTracker",
    },
    {
      id: "5",
      icon: <FontAwesome6 name="flask" size={getSize(22)} color={"green"} />,
      title: "Diagnostic Lab",
      value: "diagnostic_labs",
      screen: "TopRated",
    },
    {
      id: "6",
      icon: <FontAwesome6 name="ribbon" size={getSize(26)} color={"green"} />,
      title: "Symptoms",
      value: "symptoms", //change: should navigate to Symptoms not fetch facilities
      screen: "Symptoms",
    },
    {
      id: "7",
      icon: (
        <Ionicons name="fitness-outline" size={getSize(30)} color={"green"} />
      ),
      title: "Healthy Living",
      value: "healthy_living", //change
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
      value: "herbal_centers",
      screen: "TopRated",
    },
    {
      id: "9",
      icon: (
        <FontAwesome6 name="truck-medical" size={getSize(24)} color={"green"} />
      ),
      title: "Ambulance",
      value: "ambulance", //TODO: check if we really need this
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
      value: "homes",
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
      value: "physiotherapy_centers",
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
      value: "eye_clinics",
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
      value: "dental_clinics",
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
      value: "osteopathy_centers",
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
      value: "prosthetics_centers",
      screen: "TopRated",
    },
    {
      id: "16",
      icon: <Ionicons name="school-outline" size={40} color={"green"} />,
      title: "Health Schools",
      value: "health_schools",
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
      value: "psychiatric_centers",
      screen: "TopRated",
    },
  ];

  return { categories, width };
};

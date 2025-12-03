import { Link, usePathname } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function NavBar() {
  const pathname = usePathname();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 70,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* ---------------- HOME ---------------- */}
      <Link href="/" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/home.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: pathname === "/" ? "#E60000" : "#444",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: pathname === "/" ? "#E60000" : "#444",
              marginTop: 3,
            }}
          >
            Home
          </Text>
        </TouchableOpacity>
      </Link>

      {/* ---------------- TORNEIOS ---------------- */}
      <Link href="/listaTorneios" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/torneios.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: pathname === "/listaTorneios" ? "#0A4438" : "#444",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: pathname === "/listaTorneios" ? "#0A4438" : "#444",
              marginTop: 3,
            }}
          >
            Torneios
          </Text>
        </TouchableOpacity>
      </Link>

      {/* ---------------- PERFIL ---------------- */}
      <Link href="/" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/perfil.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: pathname === "/perfil" ? "#0A4438" : "#444",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: pathname === "/perfil" ? "#0A4438" : "#444",
              marginTop: 3,
            }}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

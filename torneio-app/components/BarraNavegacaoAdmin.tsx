import { Link, usePathname } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function NavBar() {
  const pathname = usePathname();

  const isActive = (route: string) => pathname === route;

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
      <Link href="/admin/homeAdmin" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/home.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: isActive("/") ? "#E60000" : "#444",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: isActive("/") ? "#E60000" : "#444",
              marginTop: 3,
            }}
          >
            Home
          </Text>
        </TouchableOpacity>
      </Link>

      {/* ---------------- TORNEIOS ---------------- */}
      <Link href="/admin/torneios/torneios" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/torneios.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: isActive("/listaTorneios") ? "#0A4438" : "#444",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: isActive("/listaTorneios") ? "#0A4438" : "#444",
              marginTop: 3,
            }}
          >
            Torneios
          </Text>
        </TouchableOpacity>
      </Link>

      {/* ---------------- PERFIL (Atualizado) ---------------- */}
      <Link href="/admin/perfilAdmin/perfilAdmin" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/perfil.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              // Verifica se o usuário está em qualquer tela dentro da pasta perfilAdmin
              tintColor: pathname.includes("perfilAdmin") ? "#0A4438" : "#444",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: pathname.includes("perfilAdmin") ? "#0A4438" : "#444",
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
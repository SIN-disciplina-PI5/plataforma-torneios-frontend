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

      {/* ---------------- RANKING ---------------- */}
      <Link href="/" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/ranking.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: pathname === "/ranking" ? "#0A4438" : "#444",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: pathname === "/ranking" ? "#0A4438" : "#444",
              marginTop: 3,
            }}
          >
            Ranking
          </Text>
        </TouchableOpacity>
      </Link>

      {/* ---------------- TORNEIOS ---------------- */}
      <Link href="/user/torneios/inscricoes" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/torneios.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: pathname.includes("/torneios") ? "#0A4438" : "#444",
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

      {/* ---------------- NOTIFICAÇÕES ---------------- */}
      <Link href="/" asChild>
        <TouchableOpacity style={{ alignItems: "center" }}>
          <Image
            source={require("../assets/icons/notificacoes.png")}
            style={{
              width: 24,
              height: 24,
              resizeMode: "contain",
              tintColor: pathname === "/notificacoes" ? "#0A4438" : "#444",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              color: pathname === "/notificacoes" ? "#0A4438" : "#444",
              marginTop: 3,
            }}
          >
            Notificações
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

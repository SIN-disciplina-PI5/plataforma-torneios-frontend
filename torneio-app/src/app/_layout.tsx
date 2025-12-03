import { Slot } from "expo-router";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "../../src/app/theme";
import { PaperProvider } from "react-native-paper";

export default function Layout() {
  return (
    <GluestackUIProvider config={config}>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </GluestackUIProvider>
  );
}

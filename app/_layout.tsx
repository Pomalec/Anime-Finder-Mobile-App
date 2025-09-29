import { Stack } from "expo-router";
import { SavedAnimeProvider } from "@/contexts/SavedAnimeContext";
import "./global.css";

export default function RootLayout() {
  return (
    <SavedAnimeProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{headerShown: false}}>
        </Stack.Screen>
        <Stack.Screen
          name="animes/[id]"
          options={{headerShown: false}}
        />
      </Stack>
    </SavedAnimeProvider>
  );
}

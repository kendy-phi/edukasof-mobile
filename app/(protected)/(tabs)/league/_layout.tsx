import { Stack } from 'expo-router';
import { LeagueProvider } from '@/context/LeagueContext';


export default function LeagueLayout() {

  return (
    <LeagueProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </LeagueProvider>
  );
}
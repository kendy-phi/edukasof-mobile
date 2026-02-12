import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

type Props = {
    children: ReactNode;
};

export default function Screen({ children }: Props) {

    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: 16,
                }}
            >
                {children}
            </View>
        </SafeAreaView>
    );
}

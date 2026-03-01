import { useTheme } from '@/context/ThemeContext';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    children: ReactNode;
    bottom?: number;
};

export default function Screen({ children, bottom=16 }: Props) {

    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View
                style={{
                    flex: 1,
                    paddingHorizontal: 16,
                    paddingTop: 16,
                    paddingBottom: bottom,
                }}
            >
                {children}
            </View>
        </SafeAreaView>
    );
}

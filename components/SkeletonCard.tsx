import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SkeletonCard() {
    const { theme, mode } = useTheme();

    const skeletonColor =
        mode === 'dark' ? '#1e293b' : '#e5e7eb';

    return (
        <View
            style={{
                backgroundColor: theme.card,
                borderRadius: 20,
                overflow: 'hidden',
                marginBottom: 18,
            }}
        >
            {/* Gradient area fake */}
            <View
                style={{
                    height: 160,
                    backgroundColor: skeletonColor,
                }}
            />

            {/* Bottom fake content */}
            <View style={{ padding: 16 }}>
                <View
                    style={{
                        height: 14,
                        width: '60%',
                        backgroundColor: skeletonColor,
                        borderRadius: 6,
                        marginBottom: 10,
                    }}
                />

                <View
                    style={{
                        height: 10,
                        width: '40%',
                        backgroundColor: skeletonColor,
                        borderRadius: 6,
                    }}
                />
            </View>
        </View>
    );
}

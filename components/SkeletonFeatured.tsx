import { ScrollView, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function SkeletonFeatured() {
    const { mode } = useTheme();

    const skeletonColor =
        mode === 'dark' ? '#1e293b' : '#e5e7eb';

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
        >
            {[1, 2].map((_, index) => (
                <View
                    key={index}
                    style={{
                        width: 260,
                        height: 120,
                        backgroundColor: skeletonColor,
                        borderRadius: 22,
                        marginRight: 16,
                    }}
                />
            ))}
        </ScrollView>
    );
}

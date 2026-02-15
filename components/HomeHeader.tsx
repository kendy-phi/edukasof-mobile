import { useTheme } from '@/context/ThemeContext';
import { deleteQuizzesProgress } from '@/utils/quizProgress';
import { Pressable, Text, View } from 'react-native';

type Props = {
    userName?: string;
    onToggleTheme?: () => void;
};

export default function HomeHeader({
    userName,
    onToggleTheme,
}: Props) {
    const { theme, mode, toggleTheme } = useTheme();

    const handleToggle = () => {
        if (onToggleTheme) {
            onToggleTheme();
        } else {
            toggleTheme();
        }
    };

    const removeCache = () =>{
        deleteQuizzesProgress();
    };

    return (
        <View
            style={{
                marginBottom: 24,
            }}
        >
            {/* Greeting */}
            <Text
                style={{
                    fontSize: 26,
                    fontWeight: '800',
                    color: theme.text,
                }}
            >
                Bonjour{userName ? `, ${userName}` : ''} 👋
            </Text>

            <Text
                style={{
                    marginTop: 6,
                    fontSize: 15,
                    color: theme.secondaryText,
                    fontWeight: '500',
                }}
            >
                Prêt à relever un nouveau défi ?
            </Text>

            {/* Theme Toggle */}
            <Pressable
                onPress={handleToggle}
                style={{
                    marginTop: 16,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    backgroundColor: theme.card,
                    borderWidth: 1,
                    borderColor: theme.border,
                    alignSelf: 'flex-start',
                }}
            >
                <Text
                    style={{
                        color: theme.text,
                        fontWeight: '600',
                        fontSize: 14,
                    }}
                >
                    {mode === 'light' ? '🌙 Mode sombre' : '☀️ Mode clair'}
                </Text>
            </Pressable>
            {/* clear cache to remove */}
            <Pressable
                onPress={deleteQuizzesProgress}
                style={{
                    marginTop: 16,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                    borderRadius: 12,
                    backgroundColor: theme.card,
                    borderWidth: 1,
                    borderColor: theme.border,
                    alignSelf: 'flex-start',
                }}
            >
                <Text
                    style={{
                        color: theme.text,
                        fontWeight: '600',
                        fontSize: 14,
                    }}
                >
                    supprimer les caches
                </Text>
            </Pressable>
        </View>
    );
}

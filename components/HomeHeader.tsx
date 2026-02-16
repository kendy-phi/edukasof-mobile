import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getGuestQuizCount } from '@/utils/guestLimit';
import { deleteQuizzesProgress } from '@/utils/quizProgress';
import { useEffect, useState } from 'react';
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
    const {isAuthenticated} = useAuth();
    const [remainging, setRemaining] = useState(0);

    useEffect(() => {
        const loadCount = async () => {
            if (!isAuthenticated) {
                const count = await getGuestQuizCount();
                console.log("Numbers of remain try: ", count);
                
                setRemaining(count);
            }
        };

        loadCount();
    }, []);

    const handleToggle = () => {
        if (onToggleTheme) {
            onToggleTheme();
        } else {
            toggleTheme();
        }
    };

    const removeCache = () => {
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
                Salut{userName ? `, ${userName}` : ''} 👋
            </Text>

            <Text
                style={{
                    marginTop: 6,
                    fontSize: 15,
                    color: theme.secondaryText,
                    fontWeight: '500',
                }}
            >
                Prêt à relever un nouveau défi ? {
                    !isAuthenticated ? `Il vous reste ${3 - remainging} quiz gratuits. Connectez-vous pour débloquer un accès illimité.` : ''
                }
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

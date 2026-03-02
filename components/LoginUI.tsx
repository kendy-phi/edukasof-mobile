import { Tenant } from '@/context/TenantContext';
import { useTheme } from '@/context/ThemeContext';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

// ─── Subcomponents ────────────────────────────────────────────────────────────

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: 'email-address' | 'default';
    autoComplete?: 'email' | 'password' | 'current-password';
    icon: React.ReactNode;
    rightSlot?: React.ReactNode;
};

function Field({
    label, value, onChangeText, placeholder,
    secureTextEntry, keyboardType, autoComplete, icon, rightSlot,
}: FieldProps) {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;
    const { theme } = useTheme();

    const styles = _styles_(theme);

    const handleFocus = () => {
        setFocused(true);
        Animated.timing(borderAnim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
    };

    const handleBlur = () => {
        setFocused(false);
        Animated.timing(borderAnim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.border, theme.borderFocus],
    });

    const shadowOpacity = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={styles.fieldWrap}>
            <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
            <Animated.View
                style={[
                    styles.inputContainer,
                    { borderColor },
                    { shadowColor: theme.accent, shadowOffset: { width: 0, height: 0 }, shadowRadius: 8, shadowOpacity, elevation: 0 },
                ]}
            >
                <View style={styles.inputIcon}>{icon}</View>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.muted}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoComplete={autoComplete}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={styles.input}
                    selectionColor={theme.accent}
                    cursorColor={theme.accent}
                />
                {rightSlot}
            </Animated.View>
        </View>
    );
}

// ─── Icons (inline SVG-like via Text — swap for lucide-react-native if available) ──
// If you use lucide-react-native, replace these with <Mail />, <Lock />, <Eye />, <EyeOff />

const IconEmail = (theme:any) => (
    <Text style={{ color: theme.muted, fontSize: 15 }}>✉</Text>
);
const IconLock = (theme:any) => (
    <Text style={{ color: theme.muted, fontSize: 15 }}>🔒</Text>
);
const IconWeb = (theme:any) => (
    <Text style={{ color: theme.muted, fontSize: 15 }}>🌐</Text>
);
const IconUser = (theme:any) => (
    <Text style={{ color: theme.muted, fontSize: 15 }}>👤</Text>
)


type Props = {
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    handleLogin: () => void;
    handleRegister: () => void;
    loading: boolean;
    tenant?: Tenant | null;
    school: string;
    setSchool: (v: string) => void;
    name: string;
    setName: (v: string) => void;
};

export default function LoginScreen({
    email, setEmail, password, setPassword,
    handleLogin, handleRegister, loading, tenant, school, setSchool, name, setName
}: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showName, setShowName] = useState(false);
    const { theme } = useTheme();

    const styles = _styles_(theme);
    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                bounces={false}
            >
                {/* Logo mark */}
                <View style={styles.logoMark}>
                    <Text style={styles.logoText}>E</Text>
                </View>

                {/* Heading */}
                <Text style={styles.heading}>Bon retour</Text>
                <Text style={styles.subtitle}>Connectez-vous pour débloquer un accès illimité</Text>

                {/* Fields */}
                {tenant?.type === 'full' && (<Field
                    label="ECOLE"
                    value={school}
                    onChangeText={setSchool}
                    placeholder="Url fourni par votre établissement"
                    icon={<IconWeb theme={theme} />}
                />)}

                {showName && (
                    <Field
                        label="Pseudo"
                        value={name}
                        onChangeText={setName}
                        placeholder="Votre nom d'utilisateur"
                        icon={<IconUser theme={theme} />}
                    />
                )}


                {/* Fields */}
                <Field
                    label="Adresse électronique"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@edukasof.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    icon={<IconEmail theme={theme} />}
                />

                <Field
                    label="Mot de passe"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    autoComplete="current-password"
                    icon={<IconLock />}
                    rightSlot={
                        <Pressable
                            onPress={() => setShowPassword(v => !v)}
                            style={styles.eyeBtn}
                            hitSlop={8}
                        >
                            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
                        </Pressable>
                    }
                />

                <View style={{margin:10}}/>

                {/* Forgot 
                <TouchableOpacity
                    style={styles.forgotRow}
                    onPress={() => router.push('/login')}
                >
                    <Text style={styles.forgotText}>Mot de passe oublie?</Text>
                </TouchableOpacity>
                */}

                {/* Login button */}
                <Pressable
                    onPress={!showName ? handleLogin : handleRegister}
                    disabled={loading}
                    style={({ pressed }) => [
                        styles.btnLogin,
                        pressed && styles.btnLoginPressed,
                        loading && styles.btnLoginLoading,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.background} size="small" />
                    ) : (
                        <Text style={styles.btnLoginText}>{!showName ? 'Connecté' : 'Enregistré'}</Text>
                    )}
                </Pressable>

                {/* Register */}
                {tenant?.type === 'independent' && (
                    <>
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>Vous n'avez pas de compte?</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <Pressable
                            onPress={() => setShowName(!showName)}
                            style={({ pressed }) => [
                                styles.btnRegister,
                                pressed && styles.btnRegisterPressed,
                            ]}
                        >
                            <Text style={styles.btnRegisterText}>{showName ? 'Connecté' : 'Créer un compte'}</Text>
                        </Pressable>
                    </>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const _styles_ = (C: any) =>
    StyleSheet.create({
        flex: { flex: 1, backgroundColor: C.background },

        container: {
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 28,
            paddingVertical: 48,
        },

        logoMark: {
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: C.accent,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 32,
            shadowColor: C.accent,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
        },
        logoText: { fontSize: 22, color: C.text },

        heading: {
            fontSize: 30,
            fontWeight: '400',
            // fontFamily: 'DMSerifDisplay_400Regular', // ← uncomment if using expo-google-fonts
            color: C.text,
            letterSpacing: -0.5,
            marginBottom: 6,
        },
        subtitle: {
            fontSize: 14,
            color: C.muted,
            fontWeight: '300',
            marginBottom: 36,
        },

        // ── Field ──
        fieldWrap: { marginBottom: 16 },
        label: {
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.9,
            color: C.muted,
            marginBottom: 8,
        },
        labelFocused: { color: C.accent },

        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: C.background,
            borderWidth: 1.5,
            borderRadius: 13,
            paddingHorizontal: 14,
        },
        inputIcon: { marginRight: 10, opacity: 0.8 },
        input: {
            flex: 1,
            paddingVertical: Platform.OS === 'ios' ? 15 : 13,
            fontSize: 15,
            color: C.text,
        },
        eyeBtn: { padding: 4, marginLeft: 6 },
        eyeText: { fontSize: 15 },

        // ── Forgot ──
        forgotRow: { alignItems: 'flex-end', marginTop: 6, marginBottom: 28 },
        forgotText: { fontSize: 12, color: C.muted },

        // ── Login btn ──
        btnLogin: {
            backgroundColor: C.accent,
            borderRadius: 13,
            paddingVertical: 17,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: C.accent,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 6,
        },
        btnLoginPressed: {
            transform: [{ scale: 0.97 }],
            shadowOpacity: 0.1,
        },
        btnLoginLoading: { opacity: 0.75 },
        btnLoginText: {
            fontSize: 15,
            fontWeight: '600',
            color: C.text,
            letterSpacing: 0.2,
        },

        // ── Divider ──
        divider: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginVertical: 28,
        },
        dividerLine: { flex: 1, height: 1, backgroundColor: C.border },
        dividerText: { fontSize: 12, color: C.muted },

        // ── Register btn ──
        btnRegister: {
            borderWidth: 1.5,
            borderColor: C.border,
            borderRadius: 13,
            paddingVertical: 16,
            alignItems: 'center',
        },
        btnRegisterPressed: {
            borderColor: C.accent,
            backgroundColor: C.accentGlow,
        },
        btnRegisterText: { fontSize: 14, fontWeight: '500', color: C.text },
    });
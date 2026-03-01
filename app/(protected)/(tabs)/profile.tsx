import { useAuth } from "@/context/AuthContext";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    // Mock stats (plus tard ça viendra de ton API)
    const stats = {
        totalQuizzes: 12,
        averageScore: 82,
        bestScore: 95,
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={{
                        uri:
                            user?.avatar ||
                            "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(user?.name || "User"),
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            {/* Stats Section */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Statistiques</Text>

                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Quiz</Text>
                    <Text style={styles.statValue}>{stats.totalQuizzes}</Text>
                </View>

                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Moyenne</Text>
                    <Text style={styles.statValue}>{stats.averageScore}%</Text>
                </View>

                <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Meilleur Score</Text>
                    <Text style={styles.statValue}>{stats.bestScore}%</Text>
                </View>
            </View>

            {/* Actions Section */}
            <View style={styles.card}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Modifier Profil</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Changer mot de passe</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.logoutButton]}
                    onPress={logout}
                >
                    <Text style={[styles.buttonText, styles.logoutText]}>
                        Se déconnecter
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f5f6fa",
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
    },
    email: {
        fontSize: 14,
        color: "#777",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 15,
    },
    statRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    statLabel: {
        fontSize: 14,
        color: "#555",
    },
    statValue: {
        fontSize: 14,
        fontWeight: "bold",
    },
    button: {
        paddingVertical: 12,
    },
    buttonText: {
        fontSize: 15,
    },
    logoutButton: {
        marginTop: 10,
    },
    logoutText: {
        color: "red",
        fontWeight: "bold",
    },
});
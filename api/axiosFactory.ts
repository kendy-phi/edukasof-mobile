import { ENV } from "@/config/env";
import { clearAllAuthStorage, getRefreshToken, getToken, saveTokens } from "@/utils/secureStorage";
import axios from "axios";
import { Alert } from "react-native";

export const createApiClient = (tenantUrl: string) => {

    const baseURL = tenantUrl || ENV.NEST_API;

    const api = axios.create({
        baseURL,
        timeout: 10000,
        headers: {
            Accept: 'application/json',
        },
    });

    let isRefreshing = false;
    let failedQueue: any[] = [];

    const processQueue = (error: any, token: string | null = null) => {
        failedQueue.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });

        failedQueue = [];
    };

    // 🔥 Automatically attach token
    api.interceptors.request.use(async (config) => {
        const token = await getToken();
        console.log("Add token to header", token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    // 🔁 Auto refresh logic
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            // const { response } = error;
            // console.log(error, api.defaults.baseURL, api.defaults);
            // Cas 1 : Session expirée (401 Unauthorized)
            if (error?.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                isRefreshing = true;

                try {
                    const refreshToken = await getRefreshToken();

                    if (!refreshToken) {
                        throw new Error('No refresh token');
                    }

                    const response = await axios.post(
                        `${baseURL}/auth/refresh`,
                        { refreshToken }
                    );

                    const { accessToken, refreshToken: newRefresh } = response.data;

                    await saveTokens(accessToken, newRefresh);

                    processQueue(null, accessToken);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    return api(originalRequest);

                } catch (refreshError) {
                    processQueue(refreshError, null);
                    await clearAllAuthStorage();
                    Alert.alert(
                        "Session expirée",
                        "Veuillez vous reconnecter pour continuer.",
                        [{ text: "OK", onPress: () => { /* Logique de déconnexion/redirection */ } }]
                    );
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else if (error?.response?.status === 402) {
                Alert.alert("Access!", "Vous n'avez pas accès avec la resource demander.");
            } else if (error?.response?.status >= 500) {
                // Cas 2 : Erreur serveur générique (500)
                Alert.alert("Erreur Serveur", "Un problème est survenu sur nos serveurs.");
                console.log("Error status: ", error?.response?.status)
            } else {
                // Cas 3 : Problème de connexion (Pas de réponse du serveur)
                const rawMessage = error?.response?.data?.message;

                // Sécurité : join() ne fonctionne que sur un tableau
                const message = Array.isArray(rawMessage)
                    ? rawMessage.join(', ')
                    : rawMessage; // Si c'est une string, on la garde telle quelle

                Alert.alert(
                    "Erreur Réseau",
                    message || "Le serveur ne répond pas. Vérifiez votre connexion."
                );
                console.log("Erreur :", message || "Pas de message");
            }

            return Promise.reject(error);
        }
    );

    return api;

}
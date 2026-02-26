import axios from 'axios';
import { Alert } from 'react-native';
import { ENV } from '../config/env';

export const nestApi = axios.create({
  baseURL: ENV.NEST_API,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

nestApi.interceptors.response.use(
  (response) => response, // Succès : on retourne la réponse telle quelle
  async (error) => {
    const { response } = error;

    if (response) {
      // Cas 1 : Session expirée (401 Unauthorized)
      if (response.status === 401) {
        Alert.alert(
          "Session expirée",
          "Veuillez vous reconnecter pour continuer.",
          [{ text: "OK", onPress: () => { /* Logique de déconnexion/redirection */ } }]
        );
      } 
      // Cas 2 : Erreur serveur générique (500)
      else if (response.status >= 500) {
        Alert.alert("Erreur Serveur", "Un problème est survenu sur nos serveurs.");
      }
    } 
    // Cas 3 : Problème de connexion (Pas de réponse du serveur)
    else if (error.request) {
      Alert.alert("Erreur Réseau", "Vérifiez votre connexion internet.");
    }

    return Promise.reject(error); // On propage l'erreur pour les catch locaux si besoin
  }
);

export default nestApi;


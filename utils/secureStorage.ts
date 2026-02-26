import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY     = 'EDUKASOF_TOKEN';
const REFRESH_TOKEN_KEY    = 'EDUKASOF_REFRESH_TOKEN';
const BASE_URL_KEY         = 'EDUKASOF_BASE_URL';
const TENANT_NAME_KEY      = 'EDUKASOF_TENANT_NAME';
const TENANT_TYPE_KEY      = 'EDUKASOF_TENANT_TYPE';
const QUIZ_PROGRESS_KEY    = 'EDUKASOF_QUIZ_PROGRESS';
const GUEST_QUIZ_COUNT_KEY = 'EDUKASOF_GUEST_QUIZ_COUNT';

//TOKEN
export const saveTokens = async (access_token: string, refresh_token: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
  
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

//BASE URL
export const saveBaseUrl = async (base_url: string) => {
  await SecureStore.setItemAsync(BASE_URL_KEY, base_url);
};

export const getBaseUrl = async () => {
  return await SecureStore.getItemAsync(BASE_URL_KEY);
};

export const removeBaseUrl = async () => {
  await SecureStore.deleteItemAsync(BASE_URL_KEY);
};

// TENANT NAME
export const saveTenantName = async (name: string) => {
  await SecureStore.setItemAsync(TENANT_NAME_KEY, name);
};

export const getTenantName = async () => {
  return await SecureStore.getItemAsync(TENANT_NAME_KEY);
};

export const clearAllAuthStorage = async () => {
  [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, BASE_URL_KEY, TENANT_NAME_KEY, TENANT_TYPE_KEY, QUIZ_PROGRESS_KEY, GUEST_QUIZ_COUNT_KEY].forEach(async element => {
    await SecureStore.deleteItemAsync(element);
    console.log(`${element} successfully removed`);
  });
  console.log("Cache suppression completed successfully");

};

export const saveTenantType = async (type: string) => {
  await SecureStore.setItemAsync(TENANT_TYPE_KEY, type);
};

export const getTenantType = async () => {
  return await SecureStore.getItemAsync(TENANT_TYPE_KEY);
};
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'edukasof_token';
const BASE_URL_KEY = 'edukasof_base_url';
const TENANT_NAME_KEY = 'edukasof_tenant_name';
const TENANT_TYPE_KEY = 'edukasof_tenant_type';
const QUIZ_PROGRESS_KEY = 'QUIZ_PROGRESS';
const GUEST_QUIZ_COUNT_KEY = 'GUEST_QUIZ_COUNT';

//TOKEN
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
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
  [TOKEN_KEY, BASE_URL_KEY, TENANT_NAME_KEY, TENANT_TYPE_KEY, QUIZ_PROGRESS_KEY, GUEST_QUIZ_COUNT_KEY].forEach(async element => {
    await SecureStore.deleteItemAsync(element);
    console.log("After cache suppression");

  });
};

export const saveTenantType = async (type: string) => {
  await SecureStore.setItemAsync(TENANT_TYPE_KEY, type);
};

export const getTenantType = async () => {
  return await SecureStore.getItemAsync(TENANT_TYPE_KEY);
};
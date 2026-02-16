import {
    getBaseUrl,
    getTenantName,
    getTenantType,
    saveBaseUrl,
    saveTenantName,
    saveTenantType,
} from '@/utils/secureStorage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type InstitutionType = "full" | "independent";

interface Tenant {
  type: InstitutionType;
  name: string;
  baseURL?: string; // optionnel maintenant
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  setTenant: (tenant: Tenant) => Promise<void>;
  clearTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenantState] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTenant = async () => {
      const type = await getTenantType();
      const name = await getTenantName();
      const baseURL = await getBaseUrl();

      if (type && name) {
        setTenantState({
          type: type as InstitutionType,
          name,
          baseURL: baseURL || undefined,
        });
      }

      setLoading(false);
    };

    loadTenant();
  }, []);

  const setTenant = async (tenant: Tenant) => {
    await saveTenantType(tenant.type);
    await saveTenantName(tenant.name);

    if (tenant.type === "full" && tenant.baseURL) {
      await saveBaseUrl(tenant.baseURL);
    } else {
      await saveBaseUrl(""); // pas utilisé en independent
    }

    setTenantState(tenant);
  };

  const clearTenant = async () => {
    await saveTenantType("");
    await saveTenantName("");
    await saveBaseUrl("");
    setTenantState(null);
  };

  return (
    <TenantContext.Provider
      value={{ tenant, loading, setTenant, clearTenant }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};
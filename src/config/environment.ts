export interface AppConfig {
  apiUrl: string;
  enableLogging: boolean;
  environment: 'development' | 'production' | 'test';
  version: string;
  storagePrefix: string;
}

const getConfig = (): AppConfig => {
  const isDev = import.meta.env.DEV;
  const isProd = import.meta.env.PROD;
  const isTest = import.meta.env.MODE === 'test';

  return {
    apiUrl: import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:3000' : ''),
    enableLogging: isDev || import.meta.env.VITE_ENABLE_LOGGING === 'true',
    environment: isTest ? 'test' : (isProd ? 'production' : 'development'),
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    storagePrefix: import.meta.env.VITE_STORAGE_PREFIX || 'todo-app'
  };
};

export const config = getConfig();

export const isDevelopment = config.environment === 'development';
export const isProduction = config.environment === 'production';
export const isTest = config.environment === 'test';

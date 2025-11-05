import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fintrack.app',
  appName: 'Fintrack',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;

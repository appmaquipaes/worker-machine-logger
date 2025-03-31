
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f2800f1c895c4d5bbeac520e06586e52',
  appName: 'Maquipaes SAS',
  webDir: 'dist',
  server: {
    url: 'https://f2800f1c-895c-4d5b-beac-520e06586e52.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
      releaseType: undefined,
    }
  }
};

export default config;

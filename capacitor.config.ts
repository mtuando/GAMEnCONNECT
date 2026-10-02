import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.uhgamelink.app',
  appName: 'UH GameLink',
  webDir: 'out',
  server: {
    url: 'http://10.0.2.2:2132',
    cleartext: true
  }
};

export default config;

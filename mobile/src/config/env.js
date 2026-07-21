import Constants from 'expo-constants';

const getDevApiUrl = () => {
  try {
    const hostUri =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoGo?.debuggerHost ||
      Constants?.manifest?.debuggerHost;

    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:3000/api`;
    }
  } catch (e) {
    console.warn('Error resolviendo hostUri de Expo, usando IP local fijada.');
  }
  return 'http://192.168.1.37:3000/api'; // IP por defecto
};

export const API_URL = __DEV__
  ? getDevApiUrl()
  : 'https://financeflow-api.vercel.app/api'; // Cambiar a la URL de producción real de Vercel si aplica

console.log('📡 FinanceFlow Mobile API URL configurada:', API_URL);

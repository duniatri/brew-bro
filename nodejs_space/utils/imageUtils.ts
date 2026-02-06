import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    if (!uri) {
      throw new Error('No image URI provided');
    }

    // For web data URIs, extract base64 directly
    if (uri.startsWith('data:')) {
      const base64Match = uri.match(/base64,(.*)/);
      if (base64Match?.[1]) {
        return base64Match[1];
      }
      throw new Error('Invalid data URI format');
    }

    // For web platform, fetch and convert to base64
    if (Platform.OS === 'web') {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            const base64 = result?.split?.(',')[1] ?? '';
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (webError) {
        console.error('Web base64 conversion error:', webError);
        throw new Error('Failed to process image on web');
      }
    }

    // For native platforms, use FileSystem
    // Use string 'base64' as fallback if EncodingType is undefined
    const encodingType = FileSystem?.EncodingType?.Base64 ?? 'base64';
    
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: encodingType as any,
    });

    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw new Error('Failed to process image');
  }
};

export const formatTime = (seconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(seconds ?? 0));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const parseTimeToSeconds = (timeString: string): number => {
  const parts = (timeString ?? '').split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0] ?? '0', 10) || 0;
    const secs = parseInt(parts[1] ?? '0', 10) || 0;
    return mins * 60 + secs;
  }
  return parseInt(timeString ?? '0', 10) || 0;
};

export const formatDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Unknown date';
    }
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown date';
  }
};

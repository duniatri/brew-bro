import { AnalyzeRoastRequest, AnalyzeRoastResponse } from '../types';

const getBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    // Remove trailing slash if present
    return envUrl.replace(/\/$/, '');
  }
  return 'https://fb27b8b76.preview.abacusai.app';
};

const API_TIMEOUT = 60000; // 60 seconds for image analysis

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  async analyzeRoast(base64Image: string): Promise<AnalyzeRoastResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
      const request: AnalyzeRoastRequest = {
        image: base64Image,
      };

      const response = await fetch(`${this.baseUrl}/api/analyze-roast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        return {
          success: false,
          error: `Server error: ${response.status} - ${errorText}`,
        };
      }

      const data = await response.json();
      
      // Validate response structure
      if (data?.success === true) {
        return {
          success: true,
          roastLevel: data?.roastLevel ?? 'unknown',
          temperature: {
            celsius: data?.temperature?.celsius ?? 'N/A',
            fahrenheit: data?.temperature?.fahrenheit ?? 'N/A',
          },
          description: data?.description ?? 'No description available.',
        };
      } else {
        return {
          success: false,
          error: data?.error ?? 'Analysis failed',
        };
      }
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timed out. Please try again.',
          };
        }
        return {
          success: false,
          error: `Network error: ${error.message}`,
        };
      }
      return {
        success: false,
        error: 'An unexpected error occurred.',
      };
    }
  }
}

export const apiService = new ApiService();

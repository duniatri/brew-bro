// Types matching backend API contract exactly

export interface TemperatureRange {
  celsius: string;
  fahrenheit: string;
}

export interface AnalyzeRoastRequest {
  image: string; // base64 encoded image string
}

export interface AnalyzeRoastSuccessResponse {
  success: true;
  roastLevel: string;
  temperature: TemperatureRange;
  description: string;
}

export interface AnalyzeRoastErrorResponse {
  success: false;
  error: string;
}

export type AnalyzeRoastResponse = AnalyzeRoastSuccessResponse | AnalyzeRoastErrorResponse;

// Local data structures
export interface BrewSession {
  id: string;
  beanName: string;
  roastLevel: string;
  temperature: TemperatureRange;
  brewTime: number; // in seconds
  equipment?: string; // brewing equipment used
  tasteNotes?: string; // how the coffee tasted
  createdAt: string; // ISO date string
}

export interface AnalysisResult {
  roastLevel: string;
  temperature: TemperatureRange;
  description: string;
  imageUri?: string;
}

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  CameraAnalysis: undefined;
  Timer: {
    beanName?: string;
    roastLevel?: string;
    temperature?: TemperatureRange;
  } | undefined;
  History: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

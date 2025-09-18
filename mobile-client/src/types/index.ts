export interface Sound {
  id: string;
  title: string;
  description?: string;
  duration: number;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  tags: string[];
  category: 'biophony' | 'geophony' | 'anthropophony';
  uploadedAt: Date;
  uploadedBy: string;
  license: string;
  waveformUrl?: string;
  spectrogramUrl?: string;
  audioUrl: string;
  channels: number;
  sampleRate: number;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  sounds: Sound[];
  createdAt: Date;
  isPublic: boolean;
}

export interface SearchFilters {
  location?: {
    lat: number;
    lng: number;
    radius: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  categories?: string[];
  duration?: {
    min: number;
    max: number;
  };
  channels?: number[];
  license?: string[];
}

export interface MapCluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  sounds: Sound[];
}

export type RootStackParamList = {
  Main: undefined;
  SoundDetail: { soundId: string };
};

export type TabParamList = {
  Discover: undefined;
  Search: undefined;
  Map: undefined;
  Library: undefined;
};


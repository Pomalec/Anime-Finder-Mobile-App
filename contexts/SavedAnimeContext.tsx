import React, { createContext, useContext, useState, useEffect } from 'react';

export type AnimeCategory = 'currently-watching' | 'to-watch' | 'completed' | 'on-hold' | 'dropped';

export const ANIME_CATEGORIES: { key: AnimeCategory; label: string; color: string }[] = [
  { key: 'currently-watching', label: 'Currently Watching', color: '#10B981' },
  { key: 'to-watch', label: 'Plan to Watch', color: '#3B82F6' },
  { key: 'completed', label: 'Completed', color: '#8B5CF6' },
  { key: 'on-hold', label: 'On Hold', color: '#F59E0B' },
  { key: 'dropped', label: 'Dropped', color: '#EF4444' },
];

interface SavedAnime {
  id: number;
  title: string;
  main_picture: {
    large: string;
    medium: string;
  };
  category: AnimeCategory;
  savedAt: string;
}

interface SavedAnimeContextType {
  savedAnimes: SavedAnime[];
  getSavedAnimesByCategory: (category: AnimeCategory) => SavedAnime[];
  isSaved: (id: number) => boolean;
  getSavedAnimeCategory: (id: number) => AnimeCategory | null;
  saveAnime: (anime: Omit<SavedAnime, 'savedAt'>) => Promise<void>;
  unsaveAnime: (id: number) => Promise<void>;
  updateAnimeCategory: (id: number, category: AnimeCategory) => Promise<void>;
  loading: boolean;
}

const SavedAnimeContext = createContext<SavedAnimeContextType | null>(null);

export const SavedAnimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedAnimes, setSavedAnimes] = useState<SavedAnime[]>([]);
  const [loading, setLoading] = useState(false);

  // For now, we'll just use in-memory storage
  // TODO: Add AsyncStorage persistence later
  const saveToDisk = async (animes: SavedAnime[]) => {
    // No-op for now, just in-memory storage
    console.log(`💾 Would save ${animes.length} animes to storage (in-memory only for now)`);
  };

  const getSavedAnimesByCategory = (category: AnimeCategory): SavedAnime[] => {
    return savedAnimes.filter(anime => anime.category === category);
  };

  const isSaved = (id: number): boolean => {
    return savedAnimes.some(anime => anime.id === id);
  };

  const getSavedAnimeCategory = (id: number): AnimeCategory | null => {
    const anime = savedAnimes.find(a => a.id === id);
    return anime ? anime.category : null;
  };

  const saveAnime = async (anime: Omit<SavedAnime, 'savedAt'>) => {
    if (isSaved(anime.id)) {
      console.log(`⚠️ Anime ${anime.id} is already saved`);
      return;
    }

    const animeWithTimestamp: SavedAnime = {
      ...anime,
      savedAt: new Date().toISOString(),
    };

    const newSavedAnimes = [animeWithTimestamp, ...savedAnimes];
    setSavedAnimes(newSavedAnimes);
    await saveToDisk(newSavedAnimes);
    console.log(`💾 Saved anime: ${anime.title} (ID: ${anime.id}) in category: ${anime.category}`);
  };

  const updateAnimeCategory = async (id: number, category: AnimeCategory) => {
    const updatedAnimes = savedAnimes.map(anime => 
      anime.id === id ? { ...anime, category } : anime
    );
    setSavedAnimes(updatedAnimes);
    await saveToDisk(updatedAnimes);
    console.log(`🔄 Updated anime ${id} category to: ${category}`);
  };

  const unsaveAnime = async (id: number) => {
    const anime = savedAnimes.find(a => a.id === id);
    const newSavedAnimes = savedAnimes.filter(anime => anime.id !== id);
    setSavedAnimes(newSavedAnimes);
    await saveToDisk(newSavedAnimes);
    console.log(`🗑️ Removed anime: ${anime?.title || 'Unknown'} (ID: ${id})`);
  };

  return (
    <SavedAnimeContext.Provider
      value={{
        savedAnimes,
        getSavedAnimesByCategory,
        isSaved,
        getSavedAnimeCategory,
        saveAnime,
        unsaveAnime,
        updateAnimeCategory,
        loading,
      }}
    >
      {children}
    </SavedAnimeContext.Provider>
  );
};

export const useSavedAnime = () => {
  const context = useContext(SavedAnimeContext);
  if (!context) {
    throw new Error('useSavedAnime must be used within SavedAnimeProvider');
  }
  return context;
};

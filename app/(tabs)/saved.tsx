import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import AnimeCard from '@/components/animecard'
import { useSavedAnime, ANIME_CATEGORIES, AnimeCategory } from '@/contexts/SavedAnimeContext'

const saved = () => {
  const { savedAnimes, getSavedAnimesByCategory, loading } = useSavedAnime();
  const [selectedCategory, setSelectedCategory] = useState<AnimeCategory | 'all'>('all');

  const filteredAnimes = selectedCategory === 'all' 
    ? savedAnimes 
    : getSavedAnimesByCategory(selectedCategory);

  const renderHeader = () => (
    <View>
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
      <Text className="text-lg text-white font-bold mt-5 mb-3">
        Saved Anime ({savedAnimes.length})
      </Text>

      {/* Category Filter */}
      <View className="mb-4">
        <FlatList
          data={[{ key: 'all' as const, label: 'All', color: '#6B7280' }, ...ANIME_CATEGORIES]}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                selectedCategory === item.key ? 'bg-white/20' : 'bg-dark-200/50'
              }`}
              onPress={() => setSelectedCategory(item.key)}
            >
              <View 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <Text className={`text-sm ${
                selectedCategory === item.key ? 'text-white font-medium' : 'text-gray-400'
              }`}>
                {item.label} {item.key !== 'all' && `(${getSavedAnimesByCategory(item.key as AnimeCategory).length})`}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.key}
        />
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center mt-20">
      <Image source={icons.save} className="w-16 h-16 opacity-50" style={{tintColor: '#6B7280'}} />
      <Text className="text-gray-400 text-lg mt-4 text-center">No saved anime yet</Text>
      <Text className="text-gray-500 text-sm mt-2 text-center px-8">
        Tap the save button on any anime card to add it to your saved list
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Image source={images.bg} className="absolute w-full z-0" />
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-white mt-2">Loading saved anime...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      {filteredAnimes.length === 0 ? (
        <View className="flex-1">
          {renderHeader()}
          {renderEmptyState()}
        </View>
      ) : (
        <FlatList
          data={filteredAnimes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AnimeCard 
              id={item.id} 
              main_picture={item.main_picture} 
              title={item.title}
            />
          )}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            paddingHorizontal: 20,
            marginBottom: 10,
          }}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
        />
      )}
    </View>
  )
}

export default saved
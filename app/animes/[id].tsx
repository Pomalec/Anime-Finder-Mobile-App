import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { fetchAnimeDetails } from '@/services/api'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import { useSavedAnime, AnimeCategory, ANIME_CATEGORIES } from '@/contexts/SavedAnimeContext'
import CategoryModal from '@/components/CategoryModal'

const { width } = Dimensions.get('window');

const AnimeDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const animeId = parseInt(id as string);
  
  const [animeDetails, setAnimeDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  const { isSaved, saveAnime, unsaveAnime, getSavedAnimeCategory, updateAnimeCategory } = useSavedAnime();
  
  const isAnimeSaved = isSaved(animeId);
  const savedCategory = getSavedAnimeCategory(animeId);

  useEffect(() => {
    const loadAnimeDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchAnimeDetails(animeId);
        setAnimeDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    if (animeId) {
      loadAnimeDetails();
    }
  }, [animeId]);

  const handleSavePress = () => {
    if (isAnimeSaved) {
      setShowCategoryModal(true);
    } else {
      setShowCategoryModal(true);
    }
  };

  const handleCategorySelect = (category: AnimeCategory) => {
    if (isAnimeSaved) {
      updateAnimeCategory(animeId, category);
    } else {
      saveAnime({
        id: animeId,
        title: animeDetails.title,
        main_picture: animeDetails.main_picture,
        category,
      });
    }
  };

  const handleRemoveAnime = () => {
    unsaveAnime(animeId);
  };

  const getCategoryColor = () => {
    if (!savedCategory) return 'white';
    const category = ANIME_CATEGORIES.find(cat => cat.key === savedCategory);
    return category ? category.color : '#8B5CF6';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Image source={images.bg} className="absolute w-full h-full" />
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-white mt-2">Loading anime details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-5">
        <Image source={images.bg} className="absolute w-full h-full" />
        <Text className="text-red-500 text-center text-lg mb-4">Error: {error}</Text>
        <TouchableOpacity 
          className="bg-purple-600 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!animeDetails) return null;

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-4 bg-black/30">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Image source={icons.arrow} className="w-6 h-6" style={{tintColor: 'white'}} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="p-2 rounded-full bg-black/70"
          onPress={handleSavePress}
        >
          <Image 
            source={icons.save} 
            className="w-6 h-6" 
            style={{ tintColor: getCategoryColor() }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Image and Basic Info */}
        <View className="px-5 pb-6">
          <View className="flex-row">
            <Image 
              source={{ uri: animeDetails.main_picture?.large || animeDetails.main_picture?.medium }}
              className="w-32 h-48 rounded-lg mr-4"
              resizeMode="cover"
            />
            
            <View className="flex-1">
              <Text className="text-white text-xl font-bold mb-2" numberOfLines={3}>
                {animeDetails.title}
              </Text>
              
              {animeDetails.alternative_titles?.en && (
                <Text className="text-gray-400 text-sm mb-2">
                  {animeDetails.alternative_titles.en}
                </Text>
              )}
              
              <View className="flex-row items-center mb-2">
                <Image source={icons.star} className="w-4 h-4 mr-1" />
                <Text className="text-white font-bold mr-3">
                  {animeDetails.mean || 'N/A'}
                </Text>
                <Text className="text-gray-400 text-sm">
                  Rank #{animeDetails.rank || 'N/A'}
                </Text>
              </View>
              
              <View className="flex-row flex-wrap">
                <Text className="text-purple-400 text-sm bg-purple-900/30 px-2 py-1 rounded mr-2 mb-2">
                  {animeDetails.media_type?.toUpperCase() || 'Unknown'}
                </Text>
                <Text className="text-blue-400 text-sm bg-blue-900/30 px-2 py-1 rounded mb-2">
                  {animeDetails.status?.replace('_', ' ').toUpperCase() || 'Unknown'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Synopsis */}
        <View className="px-5 mb-6">
          <Text className="text-white text-lg font-bold mb-3">Synopsis</Text>
          <Text className="text-gray-300 leading-6">
            {animeDetails.synopsis || 'No synopsis available.'}
          </Text>
        </View>

        {/* Info Grid */}
        <View className="px-5 mb-6">
          <Text className="text-white text-lg font-bold mb-3">Information</Text>
          <View className="bg-dark-200/50 rounded-lg p-4">
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-400">Episodes:</Text>
              <Text className="text-white">{animeDetails.num_episodes || 'Unknown'}</Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-400">Duration:</Text>
              <Text className="text-white">
                {animeDetails.average_episode_duration 
                  ? formatDuration(animeDetails.average_episode_duration) 
                  : 'Unknown'}
              </Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-400">Aired:</Text>
              <Text className="text-white">
                {formatDate(animeDetails.start_date)} - {formatDate(animeDetails.end_date)}
              </Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-400">Season:</Text>
              <Text className="text-white">
                {animeDetails.start_season 
                  ? `${animeDetails.start_season.season} ${animeDetails.start_season.year}`
                  : 'Unknown'}
              </Text>
            </View>
            
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-400">Source:</Text>
              <Text className="text-white">{animeDetails.source || 'Unknown'}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-400">Rating:</Text>
              <Text className="text-white">{animeDetails.rating?.toUpperCase() || 'Unknown'}</Text>
            </View>
          </View>
        </View>

        {/* Genres */}
        {animeDetails.genres && animeDetails.genres.length > 0 && (
          <View className="px-5 mb-6">
            <Text className="text-white text-lg font-bold mb-3">Genres</Text>
            <View className="flex-row flex-wrap">
              {animeDetails.genres.map((genre: any) => (
                <Text 
                  key={genre.id}
                  className="text-white text-sm bg-gray-700/50 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {genre.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Studios */}
        {animeDetails.studios && animeDetails.studios.length > 0 && (
          <View className="px-5 mb-6">
            <Text className="text-white text-lg font-bold mb-3">Studios</Text>
            <View className="flex-row flex-wrap">
              {animeDetails.studios.map((studio: any) => (
                <Text 
                  key={studio.id}
                  className="text-purple-400 text-sm bg-purple-900/30 px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {studio.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Statistics */}
        {animeDetails.statistics && (
          <View className="px-5 mb-6">
            <Text className="text-white text-lg font-bold mb-3">Statistics</Text>
            <View className="bg-dark-200/50 rounded-lg p-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Watching:</Text>
                <Text className="text-green-400">{animeDetails.statistics.status.watching || '0'}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Completed:</Text>
                <Text className="text-blue-400">{animeDetails.statistics.status.completed || '0'}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">On Hold:</Text>
                <Text className="text-yellow-400">{animeDetails.statistics.status.on_hold || '0'}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-400">Dropped:</Text>
                <Text className="text-red-400">{animeDetails.statistics.status.dropped || '0'}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-400">Plan to Watch:</Text>
                <Text className="text-purple-400">{animeDetails.statistics.status.plan_to_watch || '0'}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Related Anime */}
        {animeDetails.related_anime && animeDetails.related_anime.length > 0 && (
          <View className="px-5 mb-6">
            <Text className="text-white text-lg font-bold mb-3">Related Anime</Text>
            {animeDetails.related_anime.map((related: any, index: number) => (
              <TouchableOpacity 
                key={index} 
                className="flex-row items-center mb-3 bg-dark-200/30 p-3 rounded-lg active:bg-dark-200/50"
                onPress={() => router.push(`/animes/${related.node.id}`)}
              >
                <Image 
                  source={{ uri: related.node.main_picture?.medium }}
                  className="w-16 h-20 rounded mr-3"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-white font-medium mb-1" numberOfLines={2}>
                    {related.node.title}
                  </Text>
                  <Text className="text-purple-400 text-sm">
                    {related.relation_type_formatted}
                  </Text>
                </View>
                <Image 
                  source={icons.arrow} 
                  className="w-4 h-4 ml-2" 
                  style={{tintColor: '#6B7280', transform: [{rotate: '180deg'}]}} 
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recommendations */}
        {animeDetails.recommendations && animeDetails.recommendations.length > 0 && (
          <View className="px-5 mb-20">
            <Text className="text-white text-lg font-bold mb-3">Recommendations</Text>
            <FlatList 
              horizontal
              showsHorizontalScrollIndicator={false}
              data={animeDetails.recommendations}
              keyExtractor={(item) => item.node.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  className="mr-3 w-28 active:opacity-80"
                  onPress={() => router.push(`/animes/${item.node.id}`)}
                >
                  <Image 
                    source={{ uri: item.node.main_picture?.medium }}
                    className="w-28 h-36 rounded-lg mb-2"
                    resizeMode="cover"
                  />
                  <Text className="text-white text-sm font-medium" numberOfLines={2}>
                    {item.node.title}
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    {item.num_recommendations} recommendations
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>

      {/* Category Modal */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSelectCategory={handleCategorySelect}
        onRemove={handleRemoveAnime}
        animeTitle={animeDetails.title}
        isAlreadySaved={isAnimeSaved}
        currentCategory={savedCategory}
      />
    </View>
  );
};

export default AnimeDetails
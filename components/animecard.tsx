import { View, Text, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { useAnimeDetails } from '@/services/useAnimeDetails';
import { useSavedAnime, AnimeCategory, ANIME_CATEGORIES } from '@/contexts/SavedAnimeContext';
import CategoryModal from './CategoryModal';
import { icons } from '@/constants/icons';
const { width, height } = Dimensions.get('window');

// const { 
//     data: animes, 
//     loading: animeLoading, 
//     error:animeError 
//   } = useFetch(()=> fetchAnimeDetails({
//     query:''}
//   ))
const AnimeCard = ({id, main_picture,title }: Anime) => {
    const { data: animeDetails, loading, error } = useAnimeDetails(id);
    const { isSaved, saveAnime, unsaveAnime, getSavedAnimeCategory, updateAnimeCategory } = useSavedAnime();
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const cardWidth = (Dimensions.get('window').width - 100) / 3; // 3 cards + gap
    const cardHeight = 300; // Fixed height for all cards
    const [imageHeight, setImageHeight] = useState(200); // default height

    const isAnimeSaved = isSaved(id);
    const savedCategory = getSavedAnimeCategory(id);

    const handleSavePress = (e: any) => {
      e.preventDefault(); // Prevent navigation when pressing save button
      e.stopPropagation();
      
      // Always show the category modal, whether saving new or editing existing
      setShowCategoryModal(true);
    };

    const handleCategorySelect = (category: AnimeCategory) => {
      if (isAnimeSaved) {
        // Update existing anime category
        updateAnimeCategory(id, category);
      } else {
        // Save new anime with selected category
        saveAnime({
          id,
          title,
          main_picture,
          category,
        });
      }
    };

    const handleRemoveAnime = () => {
      unsaveAnime(id);
    };

    const getCategoryColor = () => {
      if (!savedCategory) return 'white';
      const category = ANIME_CATEGORIES.find(cat => cat.key === savedCategory);
      return category ? category.color : '#8B5CF6';
    };

useEffect(() => {
  if (main_picture.large) {
    Image.getSize(
      main_picture.large,
      (width, height) => {
        const aspectRatio = width / height;

        // If landscape, cap height to match portrait height of other cards
        if (width > height) {
          setImageHeight(cardWidth * 0.75); // example scaling
        } else {
          setImageHeight(cardWidth / aspectRatio); // scale portrait proportionally
        }
      },
      (error) => console.log(error)
    );
  }
}, [main_picture.large]);



  return (
   <Link href={`/animes/${id}`} asChild>
  <TouchableOpacity className='w-[31%] h-full'>
    <View className='relative'>
      <Image
        source={{
          uri: main_picture.large || "https://placehold.co/600x400/1a1a1a/ffffff.png"
        }}
        style={{ width: '100%', height: cardHeight, borderRadius: 10 }}
        resizeMode='contain'
      />
      {/* Save Button Overlay */}
      <TouchableOpacity 
        className='absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 flex items-center justify-center border border-white/20'
        onPress={handleSavePress}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <Image 
          source={icons.save} 
          className='w-4 h-4' 
          style={{ tintColor: getCategoryColor() }}
        />
      </TouchableOpacity>
    </View>
    <Text className='text-sm font-bold text-white mt-2' numberOfLines={2}>
      {title}
    </Text>
    <View className='flex-row items-center justify-start gap-x-1 mt-1'>
      {animeDetails && animeDetails.mean !== null && animeDetails.mean !== undefined ? (
        <>
          <Image source={icons.star} className='w-4 h-4' />
          <Text className='text-white text-xs font-bold uppercase'>{animeDetails.mean}</Text>
        </>
      ) : (
        <Text className='text-gray-400 text-xs'>No rating available</Text>
      )}
    </View>
    <View className='flex-row items-center justify-between '>
       {animeDetails && animeDetails.start_date !== null && animeDetails.start_date !== undefined ? (
        <>
         
          <Text className='flex-row text-white text-xs font-bold uppercase'>{animeDetails.start_date?.split('-')[0]}</Text>
        </>
      ) : (
        <Text className='text-gray-400 text-xs'>No year available</Text>
      )}
      <Text className='text-gray-400 font-medium text-xs uppercase '>
        {animeDetails?.media_type || 'Unknown'}
      </Text>
      </View>

    {/* Category Selection Modal */}
    <CategoryModal
      visible={showCategoryModal}
      onClose={() => setShowCategoryModal(false)}
      onSelectCategory={handleCategorySelect}
      onRemove={handleRemoveAnime}
      animeTitle={title}
      isAlreadySaved={isAnimeSaved}
      currentCategory={savedCategory}
    />
  </TouchableOpacity>
</Link>

  )
}

export default AnimeCard
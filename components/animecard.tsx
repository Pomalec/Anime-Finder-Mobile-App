import { View, Text, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { useAnimeDetails } from '@/services/useAnimeDetails';
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
    const cardWidth = (Dimensions.get('window').width - 100) / 3; // 3 cards + gap
    const cardHeight = 300; // Fixed height for all cards
    const [imageHeight, setImageHeight] = useState(200); // default height

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
    <Image
      source={{
        uri: main_picture.large || "https://placehold.co/600x400/1a1a1a/ffffff.png"
      }}
      // className='w-full h-60 rounded-lg'
       style={{ width: '100%', height: cardHeight, borderRadius: 10 }}
      resizeMode='contain' // use cover for better scaling
    />
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
  </TouchableOpacity>
</Link>

  )
}

export default AnimeCard
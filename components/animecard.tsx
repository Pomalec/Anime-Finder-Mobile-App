import { View, Text, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { fetchAnime, fetchAnimeDetails } from '@/services/api';
import useFetch from '@/services/useFetch';
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
    const [animeDetails, setAnimeDetails] = useState<any>(null); 
    const [loading, setLoading] = useState(true);
    const cardWidth = (Dimensions.get('window').width - 100) / 3; // 3 cards + gap
    const cardHeight = 500; // Fixed height for all cards
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


    useEffect(()=>{
        const fetchDetails = async () => {
            try {
              const data = await fetchAnimeDetails(id); // Pass the ID to fetch details
              setAnimeDetails(data);
            } catch (error) {
              console.error(`Failed to fetch anime details for ID ${id}:`, error);
            } finally {
              setLoading(false);
            }
          };
          fetchDetails(); // Call the function within useEffect
        }, [id]); // Add 'id' as a dependency
       
        console.log(id);
    console.log(title);
    console.log(main_picture.large);
  return (
   <Link href={`/anime/${id}`} asChild>
  <TouchableOpacity className='w-[33%] h-full'>
    <Image
      source={{
        uri: main_picture.large || "https://placehold.co/600x400/1a1a1a/ffffff.png"
      }}
      // className='w-full h-60 rounded-lg'
       style={{ width: '100%', height: cardHeight, borderRadius: 10 }}
      resizeMode='cover' // use cover for better scaling
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
  </TouchableOpacity>
</Link>

  )
}

export default AnimeCard
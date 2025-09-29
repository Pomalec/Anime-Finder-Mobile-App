import { View, Text, Image, FlatList, ActivityIndicator } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import AnimeCard from '@/components/animecard'
import { useRouter } from 'expo-router'
import { fetchAnime } from '@/services/api'
import { useSeasonalAnime } from '@/services/useSeasonalAnime'
import { useInfiniteAnime } from '@/services/useInfiniteAnime'
import { icons } from '@/constants/icons'
import Searchbar from '@/components/searchbar'

const search = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const router = useRouter();

  // Infinite scroll for both search and seasonal anime
  const { 
    data: animes, 
    loading: animeLoading,
    loadingMore,
    error: animeError,
    hasMore,
    loadMore
  } = useInfiniteAnime(searchTerm);

  // Log when component mounts (only happens once per app session for tabs)
  React.useEffect(() => {
    console.log('Search tab component mounted')
  }, [])

  const isSearching = searchTerm.trim().length > 0;
  return (
    <View className='flex-1 bg-primary '>
      <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode='cover'></Image>
      <FlatList 
      data={animes || []} 
      renderItem={({item})=>( <AnimeCard {...item.node} />)} 
      keyExtractor={(item)=> item.node.id.toString()}
      className='px-5'
      numColumns={3}
      columnWrapperStyle={{
        justifyContent: 'center',
        gap: 16,
        marginVertical: 16
      }}
      contentContainerStyle={{paddingBottom: 100}}
      onEndReached={() => {
        if (hasMore && !loadingMore && !animeLoading) {
          console.log('📜 Loading more anime...');
          loadMore();
        }
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={loadingMore ? (
        <ActivityIndicator size="large" color="#8B5CF6" className="my-5" />
      ) : null}
      ListHeaderComponent={
        <>
          <View className='w-full flex-row justify-center mt-20 items-center'>
            <Image source={icons.logo} className='w-12 h-10'></Image>
          </View>
          <View className="my-5">
            <Searchbar
              placeholder="Search for an anime..."
              value={searchTerm}
              onChangeText={(text:string) => setSearchTerm(text)}
            />
          </View>
          {animeLoading && <ActivityIndicator size={'large'} color={'white'} className='my-5 self-center'/>}
          {animeError && <Text className="text-red-500 text-center">Error: {animeError.message}</Text>}
          {!animeLoading && !animeError && searchTerm.trim() && animes && animes.length > 0 && (
            <Text className='text-white font-bold text-lg mt-5'>
              Search results for{' '}
              <Text className='font-bold text-purple-500'>{searchTerm}</Text>
            </Text>
          )}
          {!animeLoading && !animeError && searchTerm.trim() && animes && animes.length === 0 && (
            <Text className='text-gray-400 text-center text-lg mt-5'>
              No results found for "{searchTerm}"
            </Text>
          )}
          {!searchTerm.trim() && !animeLoading && animes && animes.length > 0 && (
            <Text className='text-white font-bold text-lg mt-5'>
              Current Season Anime
            </Text>
          )}
        </>
      }
      />
      
    </View>
  )
}

export default search
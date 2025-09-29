import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import Searchbar from "@/components/searchbar"
import { useRouter } from "expo-router";
import { useInfiniteAnime } from "@/services/useInfiniteAnime";
import AnimeCard from "@/components/animecard";

export default function Index() {
  const router = useRouter();

  const { 
    data: animes, 
    loading: animeLoading, 
    loadingMore,
    error: animeError,
    hasMore,
    loadMore
  } = useInfiniteAnime();

  const renderHeader = () => (
    <View>
      <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
      <Searchbar
        onPress={() => router.push("/search")}
        placeholder="Search for a anime..."
      />
      <Text className="text-lg text-white font-bold mt-5 mb-3">Seasonal Anime</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator 
        size="large" 
        color="#8B5CF6" 
        className="my-5" 
      />
    );
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !animeLoading) {
      console.log('📜 User reached end of list, loading more...');
      loadMore();
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      {animeLoading && animes.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator 
            size="large"
            color="#8B5CF6"
          />
          <Text className="text-white mt-2">Loading anime...</Text>
        </View>
      ) : animeError ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-red-500 text-center">Error: {animeError.message}</Text>
        </View>
      ) : (
        <FlatList
          data={animes}
          keyExtractor={(item) => item.node.id.toString()}
          renderItem={({ item }) => (
            <AnimeCard 
              id={item.node.id} 
              main_picture={item.node.main_picture} 
              title={item.node.title}
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
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
        />
      )}
    </View>
  );
}

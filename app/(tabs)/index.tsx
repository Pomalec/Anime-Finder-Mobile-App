import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import { Link, router } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import Searchbar from "@/components/searchbar"
import { useRouter } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchAnime } from "@/services/api";
import AnimeCard from "@/components/animecard";
export default function Index() {
  const router = useRouter();

  const { 
    data: animes, 
    loading: animeLoading, 
    error:animeError 
  } = useFetch(()=> fetchAnime({
    query:''}
  ))

  return (
   <View className="flex-1 bg-primary">
    <Image source={images.bg} className="absolute w-full z-0"></Image>
    <ScrollView className="flex-1 px-5" 
    showsVerticalScrollIndicator={false} 
    contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
      <Image source={icons.logo}className="w-12 h-10 mt-20 mb-5 mx-auto"></Image>
      {animeLoading ? (
        <ActivityIndicator 
        size={"large"}
        color={"#0000ff"}
        className="mt-10 self-center"
        />
      ) : animeError ? (
        <Text>Error : {animeError?.message}</Text>
      ) : ( 
      <View className="flex-1 mt-5">
        <Searchbar
        onPress={() => router.push("/search")}
        placeholder="Search for a anime..."
        />
        <>
        <Text 
        className="text-lg text-white font-bold mt-5 mb-3">Seasonal Anime
        </Text>
        <FlatList
        data={animes}
        keyExtractor={(item)=> item.node.id.toString()}
        renderItem={({item})=>(
          <AnimeCard 
          id={item.node.id} 
          main_picture={item.node.main_picture} 
          title={item.node.title}
          >
          </AnimeCard>
        )}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 20,
          paddingRight: 5,
          paddingBottom: 10,
        }}
        className="mt-2 pb-32"
        scrollEnabled={false}
        />
        </>
      </View>
    )}
    </ScrollView>
   </View>
  );
}

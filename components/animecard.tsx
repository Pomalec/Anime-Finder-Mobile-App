import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'


const AnimeCard = ({id, main_picture,title }: Anime) => {
    console.log(title);
    console.log(main_picture.large);
  return (
    <Link href={`/anime/${id}`} asChild>
        <TouchableOpacity className='w-[30%]'>
            <Image 
                source={{
                uri: main_picture.medium 
                ? main_picture.medium :
                "https://placehold.co/600x400/1a1a1a/ffffff.png"
            }}
            className='w-full h-56 rounded-lg'
            resizeMode='cover'/>
            <Text className='text-sm font-bold text-white mt-2'>
                {title}
            </Text>
        </TouchableOpacity>
    </Link>
    
  )
}

export default AnimeCard
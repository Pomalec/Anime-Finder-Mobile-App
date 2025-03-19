import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
interface Props {
    placeholder: string;
    onPress?: () => void;
}
const Searchbar = ({placeholder, onPress}: Props) => {
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-1'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor={"terciary"}/>
      <TextInput 
      onPress={onPress}
      placeholder={placeholder}
      value=''
      onChangeText={()=> {}}
      placeholderTextColor={"white"}
      className='flex-1 ml-2 text-white'
      />
    </View>
  )
}

export default Searchbar
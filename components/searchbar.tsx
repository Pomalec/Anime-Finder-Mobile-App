import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'
interface Props {
    placeholder: string;
    value?: string;
    onPress?: () => void;
    onChangeText?: (text: string) => void;
}
const Searchbar = ({placeholder, onPress, value, onChangeText}: Props) => {
  const handleClear = () => {
    if (onChangeText) {
      onChangeText('');
    }
  };

  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-1'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor={"terciary"}/>
      <TextInput 
      onPress={onPress}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={"white"}
      className='flex-1 ml-2 text-white'
      />
      {value && value.trim().length > 0 && (
        <TouchableOpacity onPress={handleClear} className='ml-2 p-1'>
          <Text className='text-white text-lg font-bold'>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Searchbar
import { View, Text, ImageBackground, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

const TabIcon = ({focused, icon, title}:any) =>{
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-row w-full flex-1 min-w-[100px] justify-center overflow-hidden items-center rounded-full min-h-16" >
                    <Image source={icon}
                    tintColor={"pink"} className='size-5'
                    />
                    <Text className='text-secondary  text-base ml-2 font-semibold'>{title}</Text>
                </ImageBackground>
                )
    }
    else{
        return(
            <View className='size-full justify-center items-center  rounded-full'>
            <Image source={icon} tintColor="#A8B5DB" className="size-5"/>
                    </View>
        )
       
    }
}
const _layout = () => {
  return (
 <Tabs screenOptions={{
    tabBarShowLabel:false,
    tabBarItemStyle:{
        width: "100%",
        height: '100%',
        justifyContent: "center",
        alignItems: "center"
    },
    tabBarStyle:{
        backgroundColor: "#0f0D23",
        borderRadius: 50,
        marginHorizontal: 20,
        marginBottom: 36,
        height: 52,
        position: "absolute",
        overflow: "hidden",
        borderWidth: 1,
        borderColor:"#0f0D23",
    }
 }}>
    <Tabs.Screen
    name="index"
    options={{
        title: 'Home',
        headerShown: false,
    tabBarIcon: ({focused}) => (
        <TabIcon 
        focused ={focused} 
        icon ={icons.home}
        title ="Home"
        />
    )
    }}
    ></Tabs.Screen>
     <Tabs.Screen
     name="search"
    options={{
        title: 'Search',
        headerShown: false,
        tabBarIcon: ({focused}) => (
            <TabIcon 
            focused ={focused} 
            icon ={icons.search}
            title ="Search"
            />
        )
    }}
    ></Tabs.Screen>
      <Tabs.Screen
     name="saved"
    options={{
        title: 'Saved',
        headerShown: false,
        tabBarIcon: ({focused}) => (
            <TabIcon 
            focused ={focused} 
            icon ={icons.save}
            title ="Saved"
            />
        )
    }}
    ></Tabs.Screen>
      <Tabs.Screen
     name="profile"
    options={{
        title: 'Profile',
        headerShown: false,
        tabBarIcon: ({focused}) => (
            <TabIcon 
            focused ={focused} 
            icon ={icons.person}
            title ="Profile"
            />
        )
    }}
    ></Tabs.Screen>
 </Tabs>

  )
}

export default _layout
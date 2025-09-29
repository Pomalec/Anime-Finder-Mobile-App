import { View, Text, Modal, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ANIME_CATEGORIES, AnimeCategory } from '@/contexts/SavedAnimeContext'

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: AnimeCategory) => void;
  onRemove?: () => void;
  animeTitle: string;
  isAlreadySaved?: boolean;
  currentCategory?: AnimeCategory | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ 
  visible, 
  onClose, 
  onSelectCategory, 
  onRemove,
  animeTitle,
  isAlreadySaved = false,
  currentCategory = null
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-8">
        <View className="bg-dark-200 rounded-xl p-6 w-full max-w-sm border border-white/10" 
              style={{ backgroundColor: '#1F1B2E', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 }}>
          {/* Header */}
          <Text className="text-white text-lg font-bold text-center mb-2">
            {isAlreadySaved ? 'Change Category' : 'Save to List'}
          </Text>
          <Text className="text-gray-400 text-sm text-center mb-6" numberOfLines={2}>
            {animeTitle}
          </Text>

          {/* Category Options */}
          {ANIME_CATEGORIES.map((category) => {
            const isCurrentCategory = currentCategory === category.key;
            return (
              <TouchableOpacity
                key={category.key}
                className="flex-row items-center py-4 px-4 mb-3 rounded-lg active:opacity-80"
                style={{ 
                  backgroundColor: isCurrentCategory ? '#3A3048' : '#2A2438', 
                  borderWidth: 1, 
                  borderColor: isCurrentCategory ? category.color : 'rgba(255,255,255,0.1)' 
                }}
                onPress={() => {
                  onSelectCategory(category.key);
                  onClose();
                }}
              >
                <View 
                  className="w-5 h-5 rounded-full mr-4"
                  style={{ backgroundColor: category.color, shadowColor: category.color, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.5, shadowRadius: 2 }}
                />
                <Text className="text-white text-base flex-1 font-medium">
                  {category.label}
                </Text>
                {isCurrentCategory && (
                  <Text className="text-gray-400 text-sm">Current</Text>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Remove Button (only show if already saved) */}
          {isAlreadySaved && onRemove && (
            <TouchableOpacity
              className="mt-4 py-4 px-4 rounded-lg active:opacity-80"
              style={{ backgroundColor: '#DC2626', borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.3)' }}
              onPress={() => {
                onRemove();
                onClose();
              }}
            >
              <Text className="text-white text-center font-medium text-base">Remove from List</Text>
            </TouchableOpacity>
          )}

          {/* Cancel Button */}
          <TouchableOpacity
            className="mt-3 py-4 px-4 rounded-lg active:opacity-80"
            style={{ backgroundColor: '#374151', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
            onPress={onClose}
          >
            <Text className="text-white text-center font-medium text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryModal;

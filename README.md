# Anime Finder App

A mobile app for anime fans to discover new shows and keep track of what they're watching. Built with React Native and the MyAnimeList API.

## What it does

### Browse & Discover
- See what's airing this season
- Search for any anime by title
- Get detailed info about each show (synopsis, ratings, genres, episode count, etc.)
- Keep scrolling to see more results without waiting

### Your Personal Anime List
Save anime to different lists just like on MyAnimeList:
- Currently Watching
- Plan to Watch  
- Completed
- On Hold
- Dropped

The save button changes color based on which list an anime is in, and you can easily switch between categories or remove shows.

### Smart & Fast
- Data gets cached so you don't have to wait for the same info to load twice
- Switching between tabs is instant
- No duplicate API calls means faster browsing
- Bottom tabs for easy navigation between Home, Search, Saved anime, and Profile

### More Discovery Features  
- Jump between related anime (prequels, sequels, spin-offs)
- Get recommendations based on what you're viewing
- Explore by genres and animation studios
- See how popular shows are with other users

## Tech Stack

- **React Native + Expo** - Write once, run on iOS and Android
- **TypeScript** - Catches errors before they become bugs  
- **NativeWind** - Use Tailwind CSS classes in React Native
- **Expo Router** - File-based routing (like Next.js but for mobile)
- **MyAnimeList API v2** - Real anime data from the biggest anime database
- **React Context + Custom Hooks** - Smart state management and caching
- **AsyncStorage** - Your saved anime persists between app launches

## Project Structure

```
├── app/
│   ├── (tabs)/            # Bottom tab screens
│   │   ├── index.tsx      # Home - current season
│   │   ├── search.tsx     # Search any anime
│   │   ├── saved.tsx      # Your anime lists
│   │   └── profile.tsx    # Profile (coming soon)
│   └── animes/[id].tsx    # Anime details page
├── components/
│   ├── AnimeCard.tsx      # Anime card with save button
│   ├── CategoryModal.tsx  # Modal to pick save category
│   └── Searchbar.tsx      # Search input
├── services/              # All the data fetching logic
│   ├── api.ts            # MyAnimeList API calls
│   ├── useInfiniteAnime.ts # Infinite scroll pagination
│   ├── useAnimeDetails.ts  # Caches anime details
│   └── useSeasonalAnime.ts # Current season data
├── contexts/
│   └── SavedAnimeContext.tsx # Manages your saved anime
└── constants/             # Icons and images
```

## How it works

### Smart Performance  
- Caches seasonal anime data so switching between Home and Search is instant
- Remembers anime details so you don't re-download the same info
- Infinite scrolling loads more content as you scroll (no "load more" buttons)

### The Save System
- Tap the save button on any anime card
- Pick from 5 categories (Currently Watching, Plan to Watch, etc.)
- Button color shows which list it's in
- Your saved anime stays saved between app opens (stored on your device)

### Performance Stuff
- Doesn't make unnecessary API calls - if it already has the data, it uses it
- Lists scroll smoothly even with hundreds of anime
- Switching tabs feels instant because data is shared intelligently

## Getting Started

1. Clone this repo
2. `npm install` 
3. Get a MyAnimeList API key and add it to your `.env` file
4. `npx expo start`
5. Open with Expo Go on your phone or use a simulator

## Environment Setup

You'll need a MyAnimeList API key. Create a `.env` file:
```
EXPO_PUBLIC_ANIME_CLIENT_ID=your_mal_client_id  
EXPO_PUBLIC_ANIME_API_KEY=your_mal_api_key
```

## Platform Support

Works on both iOS and Android. Same code, native performance on both platforms.

---

This started as a simple anime search app but turned into a full anime list manager. The caching system makes it fast, the save categories keep you organized, and the infinite scrolling means you can browse for hours without waiting.

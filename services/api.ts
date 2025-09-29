export const ABD_CONFIG = {
    BASE_URL: 'https://api.myanimelist.net/v2',
    CLIENT_ID: process.env.EXPO_PUBLIC_ANIME_API_KEY,
    headers: {
        accept: 'application/json',
        'X-MAL-CLIENT-ID': process.env.EXPO_PUBLIC_ANIME_CLIENT_ID, // Add this header
    }
}

export const fetchAnime = async ({query, limit = 20, offset = 0}: {query: string, limit?: number, offset?: number}) => {
    if (!ABD_CONFIG.CLIENT_ID) {
        throw new Error('Client ID is missing. Please set it in the environment variables.');
    }
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    let season: string;

    if (month >= 1 && month <= 3) season = "winter";
    else if (month >= 4 && month <= 6) season = "spring";
    else if (month >= 7 && month <= 9) season = "summer";
    else season = "fall";

    const endpoint = query 
    ? `${ABD_CONFIG.BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    : `${ABD_CONFIG.BASE_URL}/anime/season/${year}/${season}?limit=${limit}&offset=${offset}&sort=anime_score`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'X-MAL-CLIENT-ID':ABD_CONFIG.CLIENT_ID,  // Add this header
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch animes: ${response.status} ${response.status}`);
        }

        const data = await response.json();
        console.log(`📊 Fetched ${data.data?.length || 0} anime items (offset: ${offset})`)
        return {
            data: data.data || [],
            paging: data.paging || null,
        };
    
    } catch (error) {
        console.error(error);
        throw new Error('Something went wrong while fetching anime.');
    }
   
}

export const fetchAnimeDetails = async (anime_id: number) => {
    if (!ABD_CONFIG.CLIENT_ID) {
      throw new Error('Client ID is missing. Please set it in the environment variables.');
    }
  
    const endpoint = `${ABD_CONFIG.BASE_URL}/anime/${anime_id}?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics'`;
    
  
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-MAL-CLIENT-ID': ABD_CONFIG.CLIENT_ID,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch animes: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch anime details for ID ${anime_id}:`, error);
      throw new Error('Something went wrong while fetching anime details.');
    }
  };
  
// import axios from "axios";

// const fetchAnime = async (query: string) => {
//   try {
//     const response = await axios.get(
//       `https://api.myanimelist.net/v2/anime?q=${query}&limit=4`,
//       {
//         headers: {
//           Authorization: "Bearer 58c5e8c734bc873927f3c80d063d9b28" // Replace YOUR_TOKEN with your actual access token
//         }
//       }
//     );
//     console.log("Anime Data:", response.data);
//   } catch (error) {
//     console.error("Error fetching anime:", error);
//   }
// };

// // Usage example
// fetchAnime("one");

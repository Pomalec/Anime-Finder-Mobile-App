export const ABD_CONFIG = {
    BASE_URL: 'https://api.myanimelist.net/v2',
    CLIENT_ID: process.env.EXPO_PUBLIC_ANIME_API_KEY,
    headers: {
        accept: 'application/json',
        'X-MAL-CLIENT-ID': process.env.EXPO_PUBLIC_ANIME_CLIENT_ID, // Add this header
    }
}

export const fetchAnime = async ({query}: {query: string}) => {
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
    ? `${ABD_CONFIG.BASE_URL}/anime?q=${encodeURIComponent(query)}`
    : `${ABD_CONFIG.BASE_URL}/anime/season/${year}/${season}?limit=50?sort=anime_score`;
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'X-MAL-CLIENT-ID':ABD_CONFIG.CLIENT_ID,  // Add this header
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch animes: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data.data)
        return data.data || [];
    
    } catch (error) {
        console.error(error);
        throw new Error('Something went wrong while fetching anime.');
    }
   
}

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

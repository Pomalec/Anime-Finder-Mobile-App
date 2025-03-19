export const ABD_CONFIG = {
    BASE_URL: 'https://api.myanimelist.net/v2',
    API_KEY: process.env.EXPO_PUBLIC_ANIME_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_ANIME_API_KEY}`
    }
}

export const getchAnime = async ({query}: {query: string}) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    let season;

    if (month >= 1 && month <= 3) season = "winter";
    else if (month >= 4 && month <= 6) season = "spring";
    else if (month >= 7 && month <= 9) season = "summer";
    else season = "fall";
    const endpoint = query 
    ? `/anime?q=${encodeURIComponent(query)}`:
    `/anime/season/${year}/${season}?sort=anime_score`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: ABD_CONFIG.headers,
    });

    if (!response.ok) {
        //@ts-ignore
        throw new Error('Failed to fetch animes', response.statusText);
    }

    const data = await response.json();

    return data.results;
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

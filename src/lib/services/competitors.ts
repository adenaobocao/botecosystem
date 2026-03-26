// Servico de monitoramento de concorrentes via Google Places API

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || "";
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

// Coordenadas do Boteco da Estacao (Ponta Grossa centro)
const BOTECO_LAT = -25.0945;
const BOTECO_LNG = -50.1633;

export interface Competitor {
  placeId: string;
  name: string;
  rating: number;
  totalReviews: number;
  priceLevel: number | null;
  address: string;
  lat: number;
  lng: number;
  isOpen: boolean | null;
  distance: number; // km
}

export interface CompetitorDetail extends Competitor {
  reviews: {
    author: string;
    rating: number;
    text: string;
    timeAgo: string;
  }[];
  phone: string | null;
  website: string | null;
}

// Calcula distancia entre dois pontos (Haversine)
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Busca concorrentes por tipo
export async function searchCompetitors(query: string = "bares restaurantes ponta grossa pr"): Promise<Competitor[]> {
  if (!API_KEY) return [];

  try {
    const url = `${BASE_URL}/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1h
    const data = await res.json();

    if (data.status !== "OK") return [];

    return data.results.map((r: any) => ({
      placeId: r.place_id,
      name: r.name,
      rating: r.rating || 0,
      totalReviews: r.user_ratings_total || 0,
      priceLevel: r.price_level ?? null,
      address: r.formatted_address || "",
      lat: r.geometry.location.lat,
      lng: r.geometry.location.lng,
      isOpen: r.opening_hours?.open_now ?? null,
      distance: haversine(BOTECO_LAT, BOTECO_LNG, r.geometry.location.lat, r.geometry.location.lng),
    }));
  } catch (error) {
    console.error("[competitors] Search error:", error);
    return [];
  }
}

// Detalhes de um concorrente (com reviews)
export async function getCompetitorDetail(placeId: string): Promise<CompetitorDetail | null> {
  if (!API_KEY) return null;

  try {
    const fields = "name,rating,user_ratings_total,reviews,price_level,formatted_address,geometry,formatted_phone_number,website,opening_hours";
    const url = `${BASE_URL}/details/json?place_id=${placeId}&fields=${fields}&language=pt-BR&key=${API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status !== "OK") return null;

    const r = data.result;
    return {
      placeId,
      name: r.name,
      rating: r.rating || 0,
      totalReviews: r.user_ratings_total || 0,
      priceLevel: r.price_level ?? null,
      address: r.formatted_address || "",
      lat: r.geometry?.location?.lat || 0,
      lng: r.geometry?.location?.lng || 0,
      isOpen: r.opening_hours?.open_now ?? null,
      distance: haversine(BOTECO_LAT, BOTECO_LNG, r.geometry?.location?.lat || 0, r.geometry?.location?.lng || 0),
      phone: r.formatted_phone_number || null,
      website: r.website || null,
      reviews: (r.reviews || []).map((rv: any) => ({
        author: rv.author_name,
        rating: rv.rating,
        text: rv.text,
        timeAgo: rv.relative_time_description,
      })),
    };
  } catch (error) {
    console.error("[competitors] Detail error:", error);
    return null;
  }
}

// Dados pro mapa de calor
export function buildHeatmapData(competitors: Competitor[]) {
  // Agrupa por bairro (baseado na distancia radial do centro)
  const zones = [
    { name: "Centro", minDist: 0, maxDist: 1.5 },
    { name: "Estrela/Uvaranas", minDist: 1.5, maxDist: 3 },
    { name: "Oficinas/Olarias", minDist: 3, maxDist: 5 },
    { name: "Regiao Sul", minDist: 5, maxDist: 8 },
    { name: "Perifericos", minDist: 8, maxDist: 20 },
  ];

  return zones.map((zone) => {
    const inZone = competitors.filter((c) => c.distance >= zone.minDist && c.distance < zone.maxDist);
    return {
      zone: zone.name,
      count: inZone.length,
      avgRating: inZone.length > 0 ? inZone.reduce((s, c) => s + c.rating, 0) / inZone.length : 0,
      topCompetitor: inZone.sort((a, b) => b.rating - a.rating)[0]?.name || "-",
      competitors: inZone.sort((a, b) => b.totalReviews - a.totalReviews),
    };
  });
}

// Analise competitiva
export function buildCompetitiveAnalysis(competitors: Competitor[], botecoRating: number = 4.5) {
  const avgRating = competitors.length > 0 ? competitors.reduce((s, c) => s + c.rating, 0) / competitors.length : 0;
  const avgReviews = competitors.length > 0 ? competitors.reduce((s, c) => s + c.totalReviews, 0) / competitors.length : 0;
  const aboveUs = competitors.filter((c) => c.rating > botecoRating).length;
  const belowUs = competitors.filter((c) => c.rating < botecoRating).length;

  return {
    totalCompetitors: competitors.length,
    avgRating: Math.round(avgRating * 10) / 10,
    avgReviews: Math.round(avgReviews),
    botecoRating,
    aboveUs,
    belowUs,
    rankPosition: aboveUs + 1,
    percentile: competitors.length > 0 ? Math.round(((competitors.length - aboveUs) / competitors.length) * 100) : 0,
  };
}

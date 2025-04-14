const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

// Function to construct the image URL
const getImageUrl = async (photoReference: string): Promise<string> => {
  const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&maxheight=400&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
  return imageUrl;
};

// Type for a result entry
type ImageResult = {
  placeId: string;
  imageUrl: string;
};

const results: ImageResult[] = [];

export const getImageFromGoogle = async (
  placeName: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `/api/places?searchQuery=${encodeURIComponent(placeName)}`
    );
    const { place_id, photo_reference } = await response.json();

    console.log(place_id, photo_reference, response);

    if (photo_reference) {
      const image = await getImageUrl(photo_reference);
      return image;
    }

    return null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

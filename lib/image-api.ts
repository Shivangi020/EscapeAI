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
    // const t = "w0dFHGtUkTZzQF0TsUY13ruyAzI= ";
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=Spicy%20Vegetarian%20Food%20in%20Sydney%20Australia&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        placeName
      )}&inputtype=textquery&fields=photos&key=${GOOGLE_PLACES_API_KEY}`
    );

    const response2 = await fetch(url);

    console.log(response, response2, "wtf res");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const placeResponse = await response.json();
    const photoReference =
      placeResponse.candidates?.[0]?.photos?.[0]?.photo_reference;

    console.log("This is Image Data", placeResponse);

    if (photoReference) {
      // const imageUrl = await getImageUrl(photoReference);
      // results.push({ placeId: placeName, imageUrl });
      // return imageUrl;
    }

    return null;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

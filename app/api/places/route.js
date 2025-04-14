export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("searchQuery");

  if (!searchQuery) {
    return Response.json({ error: "Missing searchQuery" }, { status: 400 });
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    searchQuery
  )}&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log(response, data, "api 17");

    if (data.results?.length > 0) {
      const { place_id, photos } = data.results[0];
      const photo_reference = photos?.[0]?.photo_reference;

      // Return ONLY place_id and photo_reference
      return Response.json({ place_id, photo_reference });
    } else {
      return Response.json({ error: "No results found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching place data:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

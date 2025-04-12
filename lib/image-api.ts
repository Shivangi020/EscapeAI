interface ImageData {
  id: string
  url: string
  alt: string
}

// Mock function to simulate image API
export async function fetchImages(destination: string): Promise<ImageData[]> {
  // In a real app, this would call an image API like Unsplash
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate placeholder images
      const images: ImageData[] = []

      for (let i = 1; i <= 8; i++) {
        images.push({
          id: `image-${i}`,
          url: `/placeholder.svg?height=400&width=400`,
          alt: `${destination} - Image ${i}`,
        })
      }

      resolve(images)
    }, 600)
  })
}

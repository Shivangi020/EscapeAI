// components/ItineraryPdf.jsx
import { TravelItinerary } from "@/types";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";

const ItineraryPdf = ({
  itineraryData,
}: {
  itineraryData: TravelItinerary;
}) => (
  <Document>
    {itineraryData.itinerary.map((day) => (
      <Page key={day.day} style={{ padding: 30 }}>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 20,
            textAlign: "center",
            color: "navy",
          }}
        >
          Your Travel Itinerary
        </Text>

        <Text
          style={{
            fontSize: 18,
            marginTop: 15,
            marginBottom: 10,
            color: "darkgreen",
          }}
        >
          Day {day.day}
        </Text>

        {/* Attractions Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
            Attractions:
          </Text>
          {day.attractions.map((attraction, index) => (
            <View key={index} style={{ marginBottom: 15 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 5,
                }}
              >
                {attraction.name}
              </Text>
              <Text>{attraction.description}</Text>
              <Text style={{ fontStyle: "italic" }}>{attraction.address}</Text>
              {/* Uncomment below to show attraction image if available */}
              {/* <Image 
                style={{ width: "100%", height: 150, marginBottom: 10 }} 
                src={attraction.imageUrl} 
              /> */}
            </View>
          ))}
        </View>

        {/* Schedule Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>Schedule:</Text>
          {day.schedule.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                marginBottom: 8,
              }}
            >
              <Text style={{ width: "20%", fontWeight: "bold" }}>
                {item.time}
              </Text>
              <Text style={{ width: "80%" }}>{item.activity}</Text>
            </View>
          ))}
        </View>
      </Page>
    ))}
  </Document>
);

export default ItineraryPdf;

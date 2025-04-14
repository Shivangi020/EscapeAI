import { PDFDownloadLink } from "@react-pdf/renderer";
import ItineraryPdf from "./itinerary-pdf";

import { TravelItinerary } from "@/types";

interface DownloadButtonProps {
  itineraryData: TravelItinerary;
  className?: string;
}

const DownloadButton = ({
  itineraryData,
  className = "",
}: DownloadButtonProps) => {
  return (
    <PDFDownloadLink
      document={<ItineraryPdf itineraryData={itineraryData} />}
      fileName={`travel-itinerary-${new Date().toISOString().slice(0, 10)}.pdf`}
      className={`inline-block ${className}`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className={`
            bg-emerald-600 hover:bg-emerald-700 text-white
            font-medium py-2 px-4 rounded-lg transition-all
            flex items-center gap-2
            ${loading ? "opacity-75 cursor-not-allowed" : ""}
          `}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download Itinerary
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadButton;

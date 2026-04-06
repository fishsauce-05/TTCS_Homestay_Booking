import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import Location from "./components/Location";
import NearbyAttractions from "./components/NearbyAttractions";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/next"

export default function Home() {
  return (
    <div className="font-sans">
      {/* Hero Section */}
      <Hero />

      {/* Analytics Component */}
      <Analytics />

      {/* Gallery Section */}
      <Gallery />

      {/* Location Section */}
      <Location />

      {/* Nearby Attractions Section */}
      <NearbyAttractions />

      {/* FAQ Section */}
      <Faq />

      {/* Footer */}
      <Footer />
    </div>
  );
}


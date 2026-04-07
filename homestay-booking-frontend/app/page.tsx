import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import Location from "./components/Location";
import PopularAttractions from "./components/PopularAttractions";
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

      {/* Popular Attraction Section */}
      <PopularAttractions />

      {/* Location Section */}
      <Location />

      {/* FAQ Section */}
      <Faq />

      {/* Footer */}
      <Footer />
    </div>
  );
}


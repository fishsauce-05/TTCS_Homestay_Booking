interface StructuredDataProps {
  type?: 'homepage' | 'contact' | 'gallery';
}

export default function StructuredData({ type = 'homepage' }: StructuredDataProps) {
  // Local Business Schema for the homestay
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LodgingBusiness", "TouristAccommodation"],
    "name": "Fishsauce Homestay",
    "description": "Nền tảng booking homestay quanh Hà Nội, từ nội thành tới ngoại thành, gần nhiều danh lam thắng cảnh nổi tiếng.",
    "url": "https://tuahsuci.vercel.app",
    "telephone": "+84847318696",
    "email": "booking@fishsaucehomestay.vn",
    "priceRange": "$$",
    "currenciesAccepted": "MYR",
    "paymentAccepted": ["Cash", "Bank Transfer"],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "No 124, Kampung Teluk Jamat",
      "addressLocality": "Pokok Sena",
      "addressRegion": "Kedah",
      "postalCode": "06400",
      "addressCountry": "MY"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "6.1304302999999996",
      "longitude": "100.45532039999999"
    },
    "openingHours": "Mo-Su 00:00-24:00",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Swimming Pool",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Kitchen",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "WiFi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Air Conditioning",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Parking",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "BBQ Area",
        "value": true
      }
    ],
    "numberOfRooms": "3",
    "petsAllowed": false,
    "smokingAllowed": false,
    "checkinTime": "15:00",
    "checkoutTime": "12:00",
    "image": [
      "https://tuahsuci.vercel.app/hero-image.webp",
      "https://tuahsuci.vercel.app/gallery/image1.jpg",
      "https://tuahsuci.vercel.app/gallery/image2.jpg",
      "https://tuahsuci.vercel.app/facilities/kolam.jpg"
    ],
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61573273947769",
      "https://www.instagram.com/fishsauce.05"
    ],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "6.1304302999999996",
        "longitude": "100.45532039999999"
      },
      "geoRadius": "50000"
    },
    "starRating": {
      "@type": "Rating",
      "ratingValue": "5"
    }
  };

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Fishsauce Homestay",
    "url": "https://tuahsuci.vercel.app",
    "logo": "https://tuahsuci.vercel.app/icon1.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84847318696",
      "contactType": "Customer Service",
      "availableLanguage": ["Malay", "English"]
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61573273947769",
      "https://www.instagram.com/fishsauce.05"
    ]
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Fishsauce Homestay",
    "url": "https://tuahsuci.vercel.app",
    "description": "Booking homestay quanh Hà Nội nhanh chóng và thuận tiện",
    "publisher": {
      "@type": "Organization",
      "name": "Fishsauce Homestay"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://tuahsuci.vercel.app/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tuahsuci.vercel.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Những homestay phổ biến",
        "item": "https://tuahsuci.vercel.app/#nearby"
      }
    ]
  };

  const schemas = [localBusinessSchema, organizationSchema, websiteSchema];
  const allSchemas = type === 'homepage' ? [...schemas, breadcrumbSchema] : schemas;

  return (
    <>
      {allSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

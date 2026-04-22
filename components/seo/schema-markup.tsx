interface SchemaMarkupProps {
  type: 'organization' | 'software' | 'service';
}

export function SchemaMarkup({ type }: SchemaMarkupProps) {
  const getSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case 'organization':
        return {
          ...baseSchema,
          "@type": "Organization",
          "name": "InpromptiFy",
          "description": "Enterprise AI competency assessment and training platform",
          "url": "https://inpromptify.com",
          "logo": "https://inpromptify.com/logo.png",
          "foundingDate": "2026",
          "founders": [
            {
              "@type": "Person",
              "name": "Coiner Pro"
            }
          ],
          "sameAs": [
            "https://twitter.com/milesdoesai",
            "https://github.com/milesrunsai"
          ]
        };

      case 'software':
        return {
          ...baseSchema,
          "@type": "SoftwareApplication",
          "name": "InpromptiFy AI Assessment Platform",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Enterprise AI skills assessment and workforce training platform",
          "offers": {
            "@type": "Offer",
            "price": "10000",
            "priceCurrency": "USD",
            "priceValidUntil": "2027-12-31",
            "description": "Enterprise AI Assessment Platform"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "150",
            "bestRating": "5"
          }
        };

      case 'service':
        return {
          ...baseSchema,
          "@type": "Service",
          "name": "AI Competency Assessment",
          "description": "Professional AI skills assessment for hiring and workforce development",
          "provider": {
            "@type": "Organization",
            "name": "InpromptiFy"
          },
          "serviceType": "Assessment and Training",
          "areaServed": "Worldwide",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "AI Assessment Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Individual AI Assessment"
                }
              },
              {
                "@type": "Offer", 
                "itemOffered": {
                  "@type": "Service",
                  "name": "Enterprise AI Assessment"
                }
              }
            ]
          }
        };

      default:
        return baseSchema;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getSchema()),
      }}
    />
  );
}
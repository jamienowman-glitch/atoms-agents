export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Atoms",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "logo": "https://atoms.org/logo.png",
    "sameAs": []
  };
}

export function generateMuscleProductSchema(muscle: { name: string; description: string; price: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": muscle.name,
    "description": muscle.description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Cloud",
    "offers": {
      "@type": "Offer",
      "price": muscle.price,
      "priceCurrency": "GBP"
    }
  };
}

export function generateAgentServiceSchema(agent: { name: string; description: string; hourlyRate: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "AI Agent",
    "provider": {
      "@type": "Organization",
      "name": "Atoms"
    },
    "name": agent.name,
    "description": agent.description,
    "offers": {
      "@type": "Offer",
      "price": agent.hourlyRate,
      "priceCurrency": "GBP",
      "unitCode": "HUR"
    }
  };
}

/**
 * AGNOSTIC SCHEMA FACTORY
 * Allows full control over the Schema Type (Product, SoftwareApplication, Service, etc.)
 */
export function generateAgnosticSchema(
  schemaType: string,
  item: {
    name: string;
    description: string;
    price?: number;
    image?: string;
    sku?: string;
    brandName?: string;
    offers?: any;
    [key: string]: any
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": item.name,
    "description": item.description,
    ...(item.image && { "image": item.image }),
    ...(item.sku && { "sku": item.sku }),
    ...(item.brandName && {
      "brand": {
        "@type": "Brand",
        "name": item.brandName
      }
    }),
    ...(item.offers ? { "offers": item.offers } : (item.price ? {
      "offers": {
        "@type": "Offer",
        "price": item.price,
        "priceCurrency": "GBP",
        "availability": "https://schema.org/InStock"
      }
    } : {})),
    ...Object.keys(item).reduce((acc, key) => {
      if (!['name', 'description', 'price', 'image', 'sku', 'brandName', 'offers'].includes(key)) {
        acc[key] = item[key];
      }
      return acc;
    }, {} as any)
  };
}

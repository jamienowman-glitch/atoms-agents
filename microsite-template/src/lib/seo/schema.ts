export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Atoms",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "logo": "https://atoms.org/logo.png", // Placeholder
    "sameAs": []
  };
}

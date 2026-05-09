import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "../../../lib/hooks/useTranslation";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = "/avatar.jpeg",
  url = "https://acostajs.vercel.app/",
  type = "website",
}) => {
  const { t } = useTranslation();

  const siteTitle = title ? `${title} | Juan Acosta` : t.common.name;
  const siteDescription = description || t.home.welcome;
  const siteImage = image.startsWith("http")
    ? image
    : `${url.replace(/\/$/, "")}${image}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={siteImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={siteImage} />
    </Helmet>
  );
};

export default SEO;

interface TagsOptions {
  title: string;
  description?: string;
  image?: string;
  url?: string;
}

/**
 * Generate consistent meta tags for pages
 */
export function generateTags({
  title,
  description = "I'm a principal systems engineer at Cloudflare, working on design engineering and developer experience at the intersection of design, code, and machine learning.",
  image = 'https://charliegleason.com/social-default.png',
  url,
}: TagsOptions) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      image,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image,
    },
  };
}

export default generateTags;

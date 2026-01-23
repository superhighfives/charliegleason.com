export interface CaseStudyCard {
  id: string;
  href: string;
  title: string;
  color: string;
  hero: string;
  highlightText: string;
  highlightClasses: string;
  description: string;
  protected?: boolean;
}

// Case studies shown on the homepage
// Note: The full content is in Content Collections (src/content/case-studies/)
export const caseStudies: { title: string; data: CaseStudyCard[] } = {
  title: 'Case Studies',
  data: [
    // AppExchange Publishing - requires assets to be added to /assets/case-studies/ax-publishing/
    // Once assets (screenshot.webp, tile.webp, icon.webp) are added, remove protected: true
    {
      id: 'ax-publishing',
      href: '/work/ax-publishing',
      title: 'AppExchange Publishing',
      color: 'sky',
      hero: 'A {highlightText} of publishing.',
      highlightText: 'partner-focused overhaul',
      highlightClasses: 'text-sky-600 dark:text-sky-400',
      description:
        'Centralising the publishing process across multiple tenants, reducing the time to publish by 2.5x, dramatically speeding up the security review process by 3.5x, and 65% faster approvals.',
      protected: true, // Remove once assets are added
    },
    {
      id: 'lysterfield-lake',
      href: '/work/lysterfield-lake',
      title: 'Lysterfield Lake',
      color: 'rose',
      hero: 'An {highlightText} 3D music video.',
      highlightText: 'interactive, AI-augmented',
      highlightClasses: 'text-rose-600 dark:text-rose-400',
      description:
        "Powered by open-source tools, Lysterfield Lake is an AI-augmented music video about a place outside Melbourne, Australia. It's about the endless summers of your youth, and the tiny changes in you that you don't even notice adding up.",
    },
  ],
};

export default caseStudies;

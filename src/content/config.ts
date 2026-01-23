import { defineCollection, z } from 'astro:content';

// Metadata item schema (Team, Company, Timeline, etc.)
const metadataItemSchema = z.object({
  name: z.string(),
  content: z.union([
    z.string(),
    z.array(z.array(z.string())), // For team members: [[name, role], ...]
  ]),
});

// Case study schema
const caseStudySchema = z.object({
  // Publishing info
  published: z.coerce.date(),
  
  // Display info
  title: z.string(),
  description: z.string(),
  hero: z.string(),
  
  // Styling
  color: z.string().optional(),
  highlight: z.string(), // CSS class for highlight bar
  gradient: z.string(),  // Tailwind gradient classes
  
  // Metadata for the sidebar
  metadata: z.array(metadataItemSchema),
  
  // SEO
  ogImage: z.string().optional(),
  
  // Protection (for protected case studies)
  protected: z.boolean().optional().default(false),
});

// Case studies collection
const caseStudies = defineCollection({
  type: 'content',
  schema: caseStudySchema,
});

export const collections = {
  'case-studies': caseStudies,
};

// Export the schema type for use in components
export type CaseStudy = z.infer<typeof caseStudySchema>;
export type MetadataItem = z.infer<typeof metadataItemSchema>;

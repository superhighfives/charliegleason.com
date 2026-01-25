export interface Quote {
  id: string;
  name: string;
  role: string;
  company: string;
  hero?: boolean;
  quote: string;
  highlight: string;
}

export const quotes: Quote[] = [
  {
    id: 'margaret',
    name: 'Margaret Francis',
    role: 'Former GM',
    company: 'Heroku / Salesforce',
    hero: true,
    highlight: 'Charlie is so gifted and productive.',
    quote:
      "I would work with him again any day. It's been a great professional and personal pleasure to spend these last few years travelling in his company, and seeing the great beauty he's brought to the world through his work on Heroku. May we have the chance to do good things together again someday!",
  },
  {
    id: 'ashlyn',
    name: 'Ashlyn Watters',
    role: 'Product Architect',
    company: 'Salesforce',
    highlight:
      'Charlie is one of the most gifted, multi-skilled designers I have ever worked with.',
    quote:
      "He's an amazing collaborator and teammate. Everything he touched made our work 1,000% better.",
  },
  {
    id: 'natalie',
    name: 'Natalie Malloy',
    role: 'Senior Director',
    company: 'Salesforce',
    highlight: 'What impressed me the most was his attention to every detail, his professionalism, his leadership in this space, and also his empathy and kindness.',
    quote:
      'Oh did I mention he is one fantastic designer?',
  },
  {
    id: 'john',
    name: 'John Barton',
    role: 'CTO',
    company: 'Amber Electric',
    highlight:
      "Charlie's nicer friends will say great things about his creativity and empathy, which is true, but not interesting. Charlie has hustle.",
    quote:
      'He works and he works and he works, and that is how he got so good at what he does.',
  },
  {
    id: 'glen',
    name: 'Glen Maddern',
    role: 'Systems Engineer',
    company: 'Cloudflare',
    highlight: 'Charlie has a formidable blend of talents',
    quote:
      ": a grounded, empathetic design sense, an artist's eye for subversion, and the tenacity to do whatever—and learn whatever—is necessary to ship projects.",
  },
  {
    id: 'will',
    name: 'Will Dayble',
    role: 'Co-founder',
    company: 'Squareweave',
    highlight: 'Charlie has a',
    quote:
      'unique, articulate, polished understanding of design, art and how people interact and care for one another.',
  },
  {
    id: 'vicky',
    name: 'Vicky Zeamer',
    role: 'Lead Researcher, Research & Insights',
    company: 'Salesforce',
    highlight: 'Charlie is a supercharged teammate',
    quote:
      '. When he is assigned to something, he carries it to the finish line. He has laser-focused attention to detail [and] no fear when it comes to dealing in ambiguous and new spaces.',
  },
  {
    id: 'olivia',
    name: 'Olivia Yu',
    role: 'Lead Designer',
    company: 'Salesforce',
    highlight: '[His] talent, humor, knowledge shares, thoughtfulness, storytelling, creative contributions,',
    quote:
      "the list goes on! I'm grateful to have crossed paths.",
  },
  {
    id: 'bex',
    name: 'Becky Bolton',
    role: 'Former Developer',
    company: 'Unbound',
    highlight: 'Charlie is a developer of exceptional talent',
    quote:
      '. He is personable and fun, and these qualities made him universally loved by the team around him.',
  },
  {
    id: 'jg',
    name: 'John Geyer',
    role: 'Technical Writing Lead',
    company: 'Salesforce',
    highlight: '[Charlie is that] near-impossible combo of',
    quote: 'crazy talented and down-to-earth.',
  },
];

export default quotes;

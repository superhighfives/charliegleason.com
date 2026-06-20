export interface Bio {
  short: string;
  full: string;
}

export interface Metadata {
  location: string;
  company: string;
  website: string;
  github: string;
}

export interface Award {
  year: string;
  title: string;
}

export interface Talk {
  year: string;
  title: string;
}

export interface Education {
  degree: string;
  school: string;
  years: string;
  note?: string;
}

export interface Certification {
  year: string;
  title: string;
}

export interface Volunteering {
  org: string;
  years: string;
}

export interface Race {
  year: string;
  title: string;
}

export interface Races {
  triathlons: Race[];
  halfMarathons: Race[];
  marathons: Race[];
}

export interface ContactLink {
  label: string;
  url: string;
  icon: string;
  description: string;
}

export interface Profile {
  bio: Bio;
  metadata: Metadata;
  awards: Award[];
  talks: Talk[];
  education: Education[];
  certifications: Certification[];
  volunteering: Volunteering[];
  races: Races;
  contact: ContactLink[];
}

export const bio: Bio = {
  short:
    "I'm a principal systems engineer at Cloudflare, working on design engineering and developer experience at the intersection of code and AI.",
  full: `I'm a principal systems engineer at Cloudflare, working on design engineering and developer experience at the intersection of code and AI.

Before that I was a staff designer at Replicate, a lead product designer at Salesforce, owned design and brand at Heroku, worked on design and front-end development for London-based crowdfunding publisher Unbound, co-founded the Melbourne-based social film site Goodfilms, and was the technical lead of the Clemenger BBDO ad agency.

I studied design and computer science, and I like the space between creativity and code. I also enjoy the blind terror of the creative process, solving difficult problems, and writing custom GLSL shaders.

I cannot skateboard. I tried, but it was a whole thing.`,
};

export const metadata: Metadata = {
  location: "San Francisco, CA",
  company: "Cloudflare",
  website: "charliegleason.com",
  github: "superhighfives",
};

export const awards: Award[] = [
  {
    year: "2024",
    title: "AWWWARDS, Nomination for Typography Honors, Lysterfield Lake",
  },
  { year: "2023", title: "AWWWARDS, Honourable Mention, Lysterfield Lake" },
  {
    year: "2023",
    title: "Salesforce TMP AI Hackathon, Winner for Overall Best Hack",
  },
  {
    year: "2023",
    title: "Product Hunt, Runner Up in the 2022 Golden Kitty Awards, Pika",
  },
  { year: "2021", title: "Product Hunt, Featured, Pika" },
  { year: "2019", title: "The Ink Award, Heroku Hanafuda Cards" },
  { year: "2017", title: "Typewolf, Site of the Day, Charlie Gleason" },
  { year: "2016", title: "The FWA, Site of the Day, Kōya" },
  { year: "2016", title: "AWWWARDS, Honourable Mention, Kōya" },
  {
    year: "2016",
    title: "Kickstarter, Projects We Love, One For Sorrow, Two For Joy",
  },
  { year: "2016", title: "The FWA, Site of the Day, Rugby" },
  { year: "2016", title: "AWWWARDS, Honourable Mention, Rugby" },
  { year: "2015", title: "The FWA, Site of the Day, I Will Never Let You Go" },
  {
    year: "2015",
    title: "AWWWARDS, Honourable Mention, I Will Never Let You Go",
  },
  { year: "2015", title: "Chrome Experiments, Tweetflight" },
  {
    year: "2014",
    title: "Futurebook Innovation Awards, Best Publisher Website, Unbound",
  },
  { year: "2013", title: "Google Sandbox, Tweetflight" },
  { year: "2013", title: "The FWA, Site of the Day, Tweetflight" },
  { year: "2013", title: "AWWWARDS, Site of the Day, Tweetflight" },
  {
    year: "2011",
    title: "AWWWARDS, Site of the Day, The Story of Mick Roberts",
  },
  { year: "2011", title: "Caples, Silver, Pop What You're Not" },
  { year: "2011", title: "Award, Bronze, Pop What You're Not" },
  {
    year: "2010",
    title: "AIMIA, Nomination for Effectiveness, Pop What You're Not",
  },
  {
    year: "2010",
    title: "ADMA, Bronze for Art Direction / Craft, Pop What You're Not",
  },
  { year: "2010", title: "ADMA, Silver for Automotive, Pop What You're Not" },
  {
    year: "2010",
    title: "MADC, Bronze for Best Microsite, Pop What You're Not",
  },
  { year: "2007", title: "Design Institute of Australia, Encouragement Award" },
];

export const talks: Talk[] = [
  { year: "2024", title: "Partner Summit: The Future of AppExchange" },
  { year: "2023", title: "Dreamforce: Designing a 5 Star Partner Listing" },
  { year: "2019", title: "Creative Coding London" },
  { year: "2017", title: "JSConf Budapest (Master of Ceremonies)" },
  { year: "2016", title: "Decompress: Blending WebGL and video" },
  {
    year: "2012",
    title:
      "Web Directions South: You are a developer, the internet is your friend",
  },
  {
    year: "2012",
    title: "What Do You Know: So, you are great (and so is Less CSS)",
  },
  {
    year: "2011",
    title:
      "What Do You Know: How to make your life more awesome with CSS3 media queries",
  },
];

export const education: Education[] = [
  {
    degree: "Masters of Computer Science",
    school: "RMIT University, Melbourne",
    years: "2011 - incomplete",
  },
  {
    degree: "Bachelor of Design (Multimedia Design)",
    school: "Swinburne School of Design, Melbourne",
    years: "2004 - 2007",
    note: "First Class Honours",
  },
];

export const certifications: Certification[] = [
  {
    year: "2022",
    title: "Salesforce User Experience (UX) Designer Certification",
  },
];

export const volunteering: Volunteering[] = [
  { org: "Samaritans", years: "2020 - 2024" },
];

export const races: Races = {
  triathlons: [
    { year: "2023", title: "Blenheim Palace Triathlon (Sprint)" },
    { year: "2022", title: "Blenheim Palace Triathlon (Sprint)" },
  ],
  halfMarathons: [
    {
      year: "2025",
      title:
        "Fremont Quarry Lakes, Alameda, Santa Rosa, San Francisco Presidio, Oakland",
    },
    { year: "2022", title: "Manchester Great Run" },
    { year: "2021", title: "London Landmarks" },
  ],
  marathons: [
    { year: "2017", title: "London" },
    { year: "2015", title: "London" },
  ],
};

export const contact: ContactLink[] = [
  {
    label: "Website",
    url: "charliegleason.com",
    icon: "🌐",
    description: "Main portfolio site",
  },
  {
    label: "Writing",
    url: "code.charliegleason.com",
    icon: "📝",
    description: "Code and development blog",
  },
  {
    label: "GitHub",
    url: "github.com/superhighfives",
    icon: "🐙",
    description: "@superhighfives",
  },
  {
    label: "Twitter",
    url: "twitter.com/superhighfives",
    icon: "🐦",
    description: "@superhighfives",
  },
  {
    label: "Dribbble",
    url: "dribbble.com/superhighfives",
    icon: "🏀",
    description: "@superhighfives",
  },
  {
    label: "Email",
    url: "hello@charliegleason.com",
    icon: "📧",
    description: "Get in touch",
  },
];

export const profile: Profile = {
  bio,
  metadata,
  awards,
  talks,
  education,
  certifications,
  volunteering,
  races,
  contact,
};

export default profile;

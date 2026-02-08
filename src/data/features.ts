export interface Feature {
  icon: string;
  property: string;
  title: string;
  url: string;
}

export const features: { title: string; data: Feature[] } = {
  title: "Features",
  data: [
    {
      icon: "🗺️",
      property: "Dense Discovery",
      title: "Worthy Five: Charlie Gleason",
      url: "https://www.densediscovery.com/issues/128",
    },
    {
      icon: "💪",
      property: "Uses This",
      title: "Charlie Gleason",
      url: "https://usesthis.com/interviews/charlie.gleason/",
    },
    {
      icon: "🎵",
      property: "Fast Company",
      title: "A Band Visualizes Fans Sharing Its Music",
      url: "https://www.fastcompany.com/1672253/infographic-a-band-visualizes-fans-sharing-its-music",
    },
    {
      icon: "☕",
      property: "Generative Artistry Podcast",
      title: "In Conversation",
      url: "https://generativeartistry.com/episodes/charlie-gleason/",
    },
    {
      icon: "🔍",
      property: "Code[ish] Podcast",
      title: "The New Definition of Front-End Development",
      url: "https://www.heroku.com/podcasts/codeish/85-the-new-definition-of-frontend-development",
    },
    {
      icon: "📔",
      property: "Offscreen",
      title: "Issue Six: An Open Letter To The Web",
      url: "https://www.brizk.com/offscreen-archive/issue6/",
    },
  ],
};

export default features;

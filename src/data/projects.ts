export interface Project {
  icon: string;
  title: string;
  property: string;
  subtitle: string;
  url: string;
}

export const projects: { title: string; data: Project[] } = {
  title: "Projects",
  data: [
    {
      icon: "🌊",
      title: "Lysterfield Lake",
      property: "Music Video",
      subtitle: "An interactive AI-generated 3D fever dream",
      url: "https://lysterfieldlake.com",
    },
    {
      icon: "🎨",
      title: "Pika",
      property: "macOS",
      subtitle: "An open-source colour picker app for macOS",
      url: "https://superhighfives.com/pika",
    },
    {
      icon: "🦉",
      title: "Tweetflight",
      property: "Music Video",
      subtitle: "A Twitter-powered music video",
      url: "http://tweetflight.wewerebrightly.com/",
    },
    {
      icon: "🪄",
      title: "Releasecast",
      property: "CLI",
      subtitle: "Tooling to help you get from .app to release",
      url: "https://www.npmjs.com/package/releasecast",
    },
    {
      icon: "⛱️",
      title: "Sandpit",
      property: "Library",
      subtitle: "An open-source creative-coding library",
      url: "https://sandpitjs.com/",
    },
    {
      icon: "🎤",
      title: "Drag It Down On You",
      property: "Microsite",
      subtitle: "Lyric karaoke for Ceres, from the album of the same name",
      url: "https://dragitdownonyou.com/",
    },
    {
      icon: "🏉",
      title: "Rugby",
      property: "Music Video",
      subtitle: "A GIF-powered music video",
      url: "https://rugby.wewerebrightly.com/",
    },
    {
      icon: "💋",
      title: "I Will Never Let You Go",
      property: "Music Video",
      subtitle: "A WebGL-powered music video",
      url: "https://iwillneverletyougo.com/",
    },
    {
      icon: "🌏",
      title: "Anatole",
      property: "Landing Page",
      subtitle: "Landing page for the orchestral laptop maestro",
      url: "http://anatole.surge.sh/",
    },
    {
      icon: "🕌",
      title: "This Kind of Agility",
      property: "Website",
      subtitle: "Arrested Development episode selector",
      url: "http://thiskindofagility.superhighfives.com/",
    },
  ],
};

export default projects;

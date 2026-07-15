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
      icon: "📻",
      title: "We Are A Stream",
      property: "Radio",
      subtitle: "An endless realtime loop of Ceres' album We Are A Team",
      url: "https://github.com/superhighfives/weareastream",
    },
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
      url: "https://tweetflight.wewerebrightly.com/",
    },
    {
      icon: "🪄",
      title: "Releasecast",
      property: "CLI",
      subtitle: "Tooling to help you get from .app to release",
      url: "https://www.npmjs.com/package/releasecast",
    },
    {
      icon: "📦",
      title: "Pack",
      property: "CLI",
      subtitle: "A tiny tool to view the scripts in your package.json",
      url: "https://github.com/superhighfives/pack",
    },
    {
      icon: "💻",
      title: "Code",
      property: "Blog",
      subtitle:
        "An over-engineered code blog built on React Router 7 and Cloudflare Workers",
      url: "https://code.charliegleason.com",
    },
    {
      icon: "🖥️",
      title: "SSH",
      property: "Terminal",
      subtitle: "Run this site from the comfort of your very own terminal",
      url: "https://github.com/superhighfives/ssh.charliegleason.com",
    },
    {
      icon: "⚙️",
      title: "Dotfiles",
      property: "Config",
      subtitle:
        "My personal dotfiles and idempotent install script for a development environment",
      url: "https://github.com/superhighfives/dotfiles",
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
      url: "https://dragitdownonyou.superhighfives.com/",
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
      url: "https://iwillneverletyougo.wewerebrightly.com/",
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
      url: "https://thiskindofagility.superhighfives.com/",
    },
  ],
};

export default projects;

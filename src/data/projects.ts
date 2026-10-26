export interface Project {
  icon: string;
  title: string;
  property: string;
  subtitle: string;
  url: string;
  badge?: string;
}

export const projects: { title: string; data: Project[] } = {
  title: "Projects",
  data: [
    {
      icon: "🌊",
      title: "Lysterfield Lake",
      property: "Experimental Music Video",
      subtitle: "An interactive AI-generated 3D fever dream",
      url: "https://lysterfieldlake.com",
      badge: "Relaunched",
    },
    {
      icon: "🏷️",
      title: "Nowhere Forever",
      property: "Generative Storefront",
      subtitle: "Stickers that say something, from the catalog or your own",
      url: "https://nowhereforever.com",
      badge: "New",
    },
    {
      icon: "🖊️",
      title: "Aiplo",
      property: "Generative Art Tool",
      subtitle: "A browser sketchbook for the AxiDraw pen plotter",
      url: "https://github.com/superhighfives/aiplo",
      badge: "New",
    },
    {
      icon: "🎨",
      title: "Pika",
      property: "macOS Design Tool",
      subtitle: "An open-source colour picker app for macOS",
      url: "https://superhighfives.com/pika",
    },
    {
      icon: "🦉",
      title: "Tweetflight",
      property: "Realtime Music Video",
      subtitle: "A Twitter-powered music video",
      url: "https://tweetflight.wewerebrightly.com/",
    },
    {
      icon: "🪄",
      title: "Releasecast",
      property: "Release Automation",
      subtitle: "Tooling to help you get from .app to release",
      url: "https://www.npmjs.com/package/releasecast",
    },
    {
      icon: "📦",
      title: "Pack",
      property: "Developer Experience",
      subtitle: "A tiny tool to view the scripts in your package.json",
      url: "https://github.com/superhighfives/pack",
    },
    {
      icon: "💻",
      title: "Code",
      property: "Technical Writing",
      subtitle:
        "An over-engineered code blog built on React Router 7 and Cloudflare Workers",
      url: "https://code.charliegleason.com",
    },
    {
      icon: "💿",
      title: "Records",
      property: "Vinyl Collection",
      subtitle: "A browsable catalogue of my vinyl collection",
      url: "https://records.charliegleason.com",
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
      property: "Workflow Automation",
      subtitle:
        "My personal dotfiles and idempotent install script for a development environment",
      url: "https://github.com/superhighfives/dotfiles",
    },
    {
      icon: "⛱️",
      title: "Sandpit",
      property: "Creative Coding Toolkit",
      subtitle: "An open-source creative-coding library",
      url: "https://sandpitjs.com/",
    },
    {
      icon: "📻",
      title: "We Are A Stream",
      property: "Audio Experiment",
      subtitle: "An endless realtime loop of Ceres' album We Are A Team",
      url: "https://github.com/superhighfives/weareastream",
    },
    {
      icon: "🎤",
      title: "Drag It Down On You",
      property: "Audio Project",
      subtitle: "Lyric karaoke for Ceres, from the album of the same name",
      url: "https://dragitdownonyou.superhighfives.com/",
    },
    {
      icon: "🏉",
      title: "Rugby",
      property: "Generative Music Video",
      subtitle: "A GIF-powered music video",
      url: "https://rugby.wewerebrightly.com/",
    },
    {
      icon: "💋",
      title: "I Will Never Let You Go",
      property: "Realtime Music Video",
      subtitle: "A WebGL-powered music video",
      url: "https://iwillneverletyougo.wewerebrightly.com/",
    },
    {
      icon: "🌏",
      title: "Anatole",
      property: "Artist Identity",
      subtitle: "Landing page for the orchestral laptop maestro",
      url: "http://anatole.surge.sh/",
    },
    {
      icon: "🕌",
      title: "This Kind of Agility",
      property: "Content Discovery",
      subtitle: "Arrested Development episode selector",
      url: "https://thiskindofagility.superhighfives.com/",
    },
  ],
};

export default projects;

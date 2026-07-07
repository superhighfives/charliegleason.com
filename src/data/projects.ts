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
      subtitle: "A tool to view the scripts in your package.json",
      url: "https://github.com/superhighfives/pack",
    },
    {
      icon: "💻",
      title: "Code",
      property: "Blog",
      subtitle:
        "A little code blog built on React Router 7 and Cloudflare Workers",
      url: "https://code.charliegleason.com",
    },
    {
      icon: "🖥️",
      title: "SSH",
      property: "Terminal",
      subtitle: "Run ssh charliegleason.com in your terminal",
      url: "https://ssh.charliegleason.com",
    },
    {
      icon: "⚙️",
      title: "Dotfiles",
      property: "Config",
      subtitle: "Dotfiles and install script for a development environment",
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
      url: "https://web.archive.org/web/20240812233528/http://www.dragitdownonyou.com/",
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

export interface Article {
  icon: string;
  property: string;
  title: string;
  subtitle?: string;
  url: string;
}

export const articles: { title: string; data: Article[] } = {
  title: 'Articles',
  data: [
    {
      icon: '🔍',
      property: 'web.dev',
      title: 'Testing Web Design Color Contrast',
      subtitle:
        'An overview of three tools and techniques for testing and verifying accessible color contrast of your design.',
      url: 'https://web.dev/testing-web-design-color-contrast/',
    },
    {
      icon: '🎨',
      property: 'Medium',
      title: 'Introducing Pika',
      subtitle: 'An open-source colour picker app for macOS',
      url: 'https://medium.com/superhighfives/introducing-pika-d7725c397585',
    },
    {
      icon: '👑',
      property: 'Heroku',
      title: 'A Rock Solid, Modern Web Stack',
      subtitle: 'Rails 5 API + ActiveAdmin + Create React App',
      url: 'https://blog.heroku.com/a-rock-solid-modern-web-stack',
    },
    {
      icon: '📚',
      property: 'Medium',
      title: 'An Almost Static Stack',
      subtitle:
        'How create-react-app, with a couple of modern tools, can make building static sites (with benefits) a breeze',
      url: 'https://medium.com/superhighfives/an-almost-static-stack-6df0a2791319',
    },
    {
      icon: '🏖️',
      property: 'Medium',
      title: 'Announcing Sandpit',
      subtitle: 'A creative-coding library for the web',
      url: 'https://medium.com/superhighfives/announcing-sandpit-a5da86fd49ed',
    },
    {
      icon: '🌶️',
      property: 'Medium',
      title: 'Hot Reloading + create-react-app',
      subtitle: 'How to get hot reloading working with create-react-app',
      url: 'https://medium.com/superhighfives/hot-reloading-create-react-app-73297a00dcad',
    },
    {
      icon: '📼',
      property: 'Medium',
      title: 'An Interactive Music Video With WebGL',
      subtitle: 'Recreating After Effects in the browser',
      url: 'https://medium.com/superhighfives/making-a-music-video-f60757ceb4cf',
    },
  ],
};

export default articles;

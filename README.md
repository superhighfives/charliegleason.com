<img src="https://charliegleason.com/emoji/😊" alt="Blushing face emoji" width="64" height="64" />

# Charlie Gleason (dot com)

This repo houses the [charliegleason.com](https://charliegleason.com/) app, built to work On The Edge™️, with Cloudflare Pages. It was made using Remix.

- Learn more about [Remix via their Docs](https://remix.run/docs)
- Learn more about [Cloudflare Pages](https://pages.cloudflare.com/)

## Development

To get up and running, fork the repo and install the dependencies:

```sh
$ gh repo fork superhighfives/charliegleason.com
$ cd charliegleason.com
$ npm install
```

Also, if you make any changes to the article emojis, or add new ones to the [`emoji-list.ts`](https://github.com/superhighfives/charliegleason.com/blob/main/app/utils/emoji-list.ts) file, you'll need to re-generate images:

```sh
$ npm run generate:images
```

This set up uses Wrangler for local development, to emulate the Cloudflare runtime. To get started, run `npm run dev`:

```sh
# start the remix dev server / wrangler
$ npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788), then celebrate.

## Deployment

Cloudflare Pages are currently only deployable through their Git provider integrations.

If you don't already have an account, you can [create a Cloudflare account here](https://dash.cloudflare.com/sign-up/pages). After verifying your email address with Cloudflare, go to your shiny new dashboard and follow the [Cloudflare Pages deployment guide](https://developers.cloudflare.com/pages/framework-guides/deploy-anything).

(And just to be sure, the "Build command" should be set to `npm run build`, and the "Build output directory" should be set to `public`.)

## Interesting Bits

Probably the most unique thing about the project is the automagic emoji generator, which is housed in the [`$emoji.tsx`](https://github.com/superhighfives/charliegleason.com/blob/main/app/routes/emoji/%24emoji.tsx) file.

It generates an animated SVG, with base64 encoded raster images, on the fly. It has a couple of options available as part of the API, too. You can add the following url params:

| Title      | Value   | Default | Description                                                                                               |
| ---------- | ------- | ------- | --------------------------------------------------------------------------------------------------------- |
| `animated` | boolean | true    | Describes whether the SVG animates through a collection of images before landing on the final one         |
| `detailed` | boolean | true    | Describes whether the SVG includes the time it was generated (as a 12 hour clock) around the outside edge |

You can also pass up to three emoji to the API url to see the generation in real time (the emoji need to be in the [`emoji-list.ts`](https://github.com/superhighfives/charliegleason.com/blob/main/app/utils/emoji-list.ts) file, or used in an article).

Examples:
- https://charliegleason.com/emoji/💃🐒
- https://charliegleason.com/emoji/💃🐒?animated=false
- https://charliegleason.com/emoji/💃🐒?animated=false&detailed=false

## Development

The app was auto-generated by `create-remix`:
```
$ npx create-remix

? What type of app do you want to create?
  Just the basics

? Where do you want to deploy?
  Cloudflare Pages
```

## Thanks

- [Matt Stobbs](https://twitter.com/matt_stobbs) and his [Complete Guide to Dark Mode with Remix](https://www.mattstobbs.com/remix-dark-mode/)
- [Glen Maddern](https://twitter.com/glenmaddern) for the Remix and Cloudflare help

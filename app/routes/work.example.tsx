import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/cloudflare'
import { requireUserId } from '~/session.server'
import { EMOJI_URL } from '~/constants'
import tags from '~/utils/tags'
import { useMatches } from '@remix-run/react'
import Layout from '~/components/ui/layout'
import Header from '~/components/ui/header'
import Footer from '~/components/sections/footer'

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  const parentsData = matches[0].data

  const metatags = tags({
    title: 'Charlie Gleason is a work in progress.',
    image: 'https://charliegleason.com/social-default.png',
  })

  return [
    ...metatags,
    {
      tagName: 'link',
      rel: 'icon',
      type: 'image/svg',
      href: `${EMOJI_URL}${parentsData.symbol || '💀'}?animated=false`,
    },
  ]
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  return await requireUserId(request, context)
}

export default function ExamplePage() {
  const { symbol, photo, user } = useMatches().find(
    (route) => route.id === 'root'
  )?.data ?? { symbol: '💀', photo: '01', user: { id: 'unauthenticated' } }

  return (
    <Layout wide>
      <Header symbol={symbol} photo={photo} />
      <div>
        <h1 id="lysterfield-lake">Lysterfield Lake</h1>
        <h2 id="machine-learning-art-accelerometers-and-the-joy-of-slow-progress-and-fast-feedback-loops-or-how-i-built--lysterfield-lake">
          Machine learning, art, accelerometers, and the joy of slow progress
          and fast feedback loops (or, how I built{' '}
          <a href="https://lysterfieldlake.com/">Lysterfield Lake</a>)
        </h2>
        <hr />
        <p>
          <a href="https://wearebrightly.com/">Lysterfield Lake</a> is a song
          about a place outside Melbourne, Australia. It’s about the endless
          summers of your youth, and the tiny changes in you that you don’t even
          notice adding up. It’s also about memories, which, like polaroids,
          fade and change over time.
        </p>
        <p>
          I don’t remember exactly when I wrote it in much the same way I don’t
          remember exactly when I started this project, which has spanned the
          better part of a year and has all but consumed the most creative bits
          of my brain.
        </p>
        <p>
          I think it all began when I came across{' '}
          <a href="https://replicate.com/">Replicate</a> (and by extention,
          their open-source container for running machine learning models,{' '}
          <a href="https://github.com/replicate/cog">Cog</a>.) I was so inspired
          by their <a href="https://replicate.com/explore">Explore</a> page,
          and, if I’m being totally honest, I was worried about the cost of
          experimenting with AI. I’d set up a gaming PC in the weird limbo of
          the 2020 lockdowns, and these tools made it effortless (and for the
          most part, free) to try, and test, and many, many times, fail.
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:7720/1*1-nWOHdCsr71AmDZqTfzXg.jpeg"
            alt=""
          />
        </p>
        <p>A selection of dreams from the final video.</p>
        <p>
          When I decided to release new music (it’s been seven years since{' '}
          <a href="https://wearebrightly.com/">the last Brightly record</a>) I
          knew I wanted to build something with these bits and pieces I’d been
          noodling with. I knew I wasn’t great at making traditional music
          videos, and I felt empowered by the flexibility of the browsers, and
          the creative opportunties afforded by using machine learning and AI. I
          think the result is something greater than the sum of its parts.
        </p>
        <p>And there are a lot of parts.</p>
        <p>
          (Also, if you haven’t seen the video,{' '}
          <a href="https://lysterfieldlake.com/">
            you should go and check it out
          </a>{' '}
          before I ruin the magic by shining a very bright light on exactly how
          it all works.)
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*TfMVHZLXL5DO_d9S_vfrRw.gif"
            alt=""
          />
        </p>
        <p>
          (And if you’d{' '}
          <a href="https://youtu.be/a-9gGCQIPo8">
            rather check out a recording, you can jump over to YouTube
          </a>{' '}
          to see a simplified version that should give you a pretty good idea.)
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:10386/1*Pj698pLZ61e0nNBy9uCLkg.jpeg"
            alt=""
          />
        </p>
        <p>
          Three images from the video at{' '}
          <a href="https://lysterfieldlake.com/">
            https://lysterfieldlake.com/
          </a>
        </p>
        <h1 id="what-is-it">What is it?</h1>
        <p>
          <a href="https://lysterfieldlake.com/">Lysterfield Lake</a> is a 3D
          generative interactive music video. It works in the browser, using{' '}
          <a href="https://threejs.org/">Three.js</a> and{' '}
          <a href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction">
            react-three-fiber
          </a>{' '}
          to stitch together seven feeds of video frame by frame, turning a
          single piece of footage shot on an iPhone into a three-dimensional
          fever dream. It uses the accelerometer in your phone, if it’s
          available, or your mouse if you’re on a computer. It shows and hides
          the protagonist as you watch depending on your actions, offering a
          myriad of ways to experience it. New dreams can be added at any time.
        </p>
        <p>
          Behind the scenes it was modelled in{' '}
          <a href="https://www.blender.org/">Blender</a>, (using a polaroid
          model by{' '}
          <a href="https://sketchfab.com/edoardogalati">Edoardo Galati</a>),
          generated in python and shell scripts, and built in JavaScript. It is
          made up of entirely open-source projects that are freely available.
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*CbNvx0bZX2ay66YRCR1zkA.jpeg"
            alt=""
          />
        </p>
        <p>A frame of each of the initial dreams.</p>
        <h1 id="the-process">The process</h1>
        <p>So, how does it work? I made a diagram to help.</p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*uF2V2tVSWz7O0iaPv2Jw5A.png"
            alt=""
          />
        </p>
        <p>
          First, a single video file, shot on an iPhone, is fed through a series
          of python and shell scripts. The initial one splits the video into
          individual frames. These frames then go through a bunch of processes
          depending on their final output.
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*O9RTYpMfIXkLZUwKTRZ5Iw.gif"
            alt=""
          />
        </p>
        <p>
          The original footage vs the final output. Note to self: I probably
          should’ve gotten a haircut before this.
        </p>
        <h2 id="the-avatar">
          <strong>The Avatar</strong>
        </h2>
        <p>
          A 3D-watercolour version of the subject matter (which is, in this
          case, me).
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*8qstZlyYHy-fJMnLJ1-lXQ.png"
            alt=""
          />
        </p>
        <ul>
          <li>
            <a href="https://replicate.com/gwang-kim/diffusionclip?input=form&output=preview">
              DiffusionCLIP
            </a>{' '}
            turns the image into a painted watercolour style.
          </li>
          <li>
            <a href="https://replicate.com/arielreplicate/robust_video_matting?input=form&output=preview">
              RobustVideoMatting
            </a>{' '}
            finds the subject in the video and creates an alpha mask of it.
          </li>
          <li>
            In python, the mask is used with the original image and passed to{' '}
            <a href="https://replicate.com/cjwbw/zoedepth?input=form&output=preview">
              ZoeDepth
            </a>
            , which creates a depth mask.
          </li>
          <li>
            These three elements (the watercolour image, the alpha mask, and the
            depth mask) are used to render the avatar.
          </li>
        </ul>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*4WeH4TJLoUkKhE5QSVXclQ.png"
            alt=""
          />
        </p>
        <p>From frame to 3D avatar.</p>
        <h2 id="the-background">
          <strong>The Background</strong>
        </h2>
        <p>
          A watercolour version of the original image, without the subject
          matter.
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*ucApjXjEx7PgRC3U7L2lWg.png"
            alt=""
          />
        </p>
        <ul>
          <li>
            Using the alpha mask and the original image,{' '}
            <a href="https://github.com/geekyutao/Inpaint-Anything">
              Inpaint Anything
            </a>{' '}
            creates a version of the scene without the avatar in it.
          </li>
          <li>
            This inpainted image is then also painted in watercolour using{' '}
            <a href="https://replicate.com/gwang-kim/diffusionclip?input=form&output=preview">
              DiffusionCLIP
            </a>
            .
          </li>
          <li>This element is then used to render the background.</li>
        </ul>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*_FR2X3LnJtr0Ikdo4HzNhA.png"
            alt=""
          />
        </p>
        <p>From frame to watercolour background.</p>
        <h2 id="the-outline">
          <strong>The Outline</strong>
        </h2>
        <p>A comic-book style sketch of the subject matter.</p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*tZ2W3LOsMK0Zgnv4J9uFcg.png"
            alt=""
          />
        </p>
        <ul>
          <li>
            In python, the original image is combined with the alpha mask to
            create a version with no background.
          </li>
          <li>
            This is then fed into{' '}
            <a href="https://github.com/Linzmin1927/Artline_torch">
              artline-torch
            </a>
            , which creates a rough outline sketch.
          </li>
          <li>
            This sketch is then overlaid on the avatar during rendering (it also
            uses a bit of dithering in the custom shader in{' '}
            <a href="https://threejs.org/">Three.js</a>, which is what gives it
            the printed ink / slight comic book style).
          </li>
        </ul>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*o05fPcO6egw_Bcn76pzOVw.png"
            alt=""
          />
        </p>
        <p>From frame to outline.</p>
        <h2 id="the-dreams">
          <strong>The Dreams</strong>
        </h2>
        <p>Prompt-generated reinterpretations of the original image.</p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*bs4WNCcCUIbKt9ydA29Qvg.png"
            alt=""
          />
        </p>
        <ul>
          <li>
            The original images are fed into{' '}
            <a href="https://replicate.com/deforum/deforum_stable_diffusion?input=form&output=preview">
              Deforum Stable Diffusion
            </a>
            , along with a prompt, creating unique scenes that mirror the
            subject matter. For example, trees and a lake that match the
            contours of the image.
          </li>
        </ul>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*Njykj7-c0k2SEx9ezR6Xbg.png"
            alt=""
          />
        </p>
        <p>From frame to dreams.</p>
        <ul>
          <li>
            Finally, each frame is manually reviewed one by one and removed if
            not appropriate. (The primary reason for this is that Stable
            Diffusion models are trained on image sets that include a large
            amount of{' '}
            <a href="https://www.dictionary.com/e/fictional-characters/waifu/">
              waifu
            </a>
            ’s. Which, because the input clearly contains the shape of a person,
            means a lot of waifu’s end up in the output, even when politely
            asking Stable Diffusion not to.)
          </li>
        </ul>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*ax7w7RChWtryBx3B8RuJ2A.png"
            alt=""
          />
        </p>
        <p>
          Turns out every creative process eventually takes a sharp detour into
          the uncanniest valleys.
        </p>
        <ul>
          <li>
            The remaining images are fed into{' '}
            <a href="https://github.com/nihui/rife-ncnn-vulkan">
              rife-ncnn-vulkan
            </a>
            , which interpolates the missing frames and generates new ones to
            fill the gaps.
          </li>
        </ul>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*0ah4bLw1ap2eV8N9Gy4F_w.png"
            alt=""
          />
        </p>
        <h2 id="the-lyrics">
          <strong>The Lyrics</strong>
        </h2>
        <p>
          (Apologies for my handwriting. I clearly should’ve been a doctor.)
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*Y0nHCS61apVlbhbHwbOnig.png"
            alt=""
          />
        </p>
        <p>
          At the same time, I recorded myself hand writing the lyrics in
          Procreate, and then cleaned them up in Adobe’s After Effects.
        </p>
        <h2 id="the-output">The output</h2>
        <p>An ultra-wide for each dream.</p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*yt-7FiGDVvX5ZTmHhknjlQ.png"
            alt=""
          />
        </p>
        <p>
          This gets stitched together into an ultra-wide video with 7 square
          images side-by-side. Originally I tried using a single video for each
          element, but it‘s impossible to guarantee frame sync across multiple
          videos in the browser. Fortunately, much like how there’s no rule
          against eating a candy bar on a dance floor, there’s no rule that
          videos need to be 16x9. Using custom shaders in the browser, you can
          simply grab the crop of footage you need for each element in real
          time.
        </p>
        <p>
          And having all of these elements in the one shader affords new
          opportunities. By passing the depth mask, alpha mask, and the
          watercolour scene, I was able to generate a rough 3D model.
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*ExHGyPIM2NJm8a6SOlUI0Q.png"
            alt=""
          />
        </p>
        <p>An example of the 3D avatar rendering process.</p>
        <p>
          Custom shaders essentially let you paint with pixels in real time, and
          it’s an incredibly exciting medium once you start to explore the
          possibilities. It is how I can use the pixels from the depth mask to
          directly impact how close or far each fragment of the 3D avatar is.
          And, if you’d like to learn more,{' '}
          <a href="https://thebookofshaders.com/">The Book of Shaders</a> is a
          great resource.
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*Kh7s2QnV0Vh8g44LuQfNFw.gif"
            alt=""
          />
        </p>
        <p>
          AI interpreting a depth mask from a video, because we live in the
          future. (Also, I hand painted a lot of these frames, because
          technology is, sadly, fallible.)
        </p>
        <p>
          Each frame of each video includes the handwritten lyrics, the
          watercolour scene, the watercolour scene with the background removed,
          the alpha mask, the depth mask, the sketch, and the dream. And those
          ultra-wide videos form the backbone of the project.
        </p>
        <h2 id="the-conclusion">The conclusion</h2>
        <p>
          The selected dream, represented by one of these videos, is then
          chopped up and stitched back together in real time in the browser,
          using{' '}
          <a href="https://github.com/pmndrs/react-three-fiber">
            react-three-fiber
          </a>
          , and many of the incredible resources provided{' '}
          <a href="https://github.com/pmndrs/drei/">
            as part of the drei project
          </a>
          . You can explore each dream one by one, wandering through a landscape
          that has been imagined by a computer, listening to a song about a time
          that sits on the very edge of my conciousness. Memory, like AI, is
          funny like that.
        </p>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:2000/1*ZxvNeoEsg39DUED7Q9lu9g.png"
            alt=""
          />
        </p>
        <p>The rendered final output.</p>
        <p>
          This is a probably a good time to mention that, while this is the
          conclusion, this project took every possible detour, hit every
          possible technical hitch, and explored every possible weird twist and
          turn. What I’ve ended up with is absolutely nothing like what I
          imagined, because I didn’t really know what I was going to get at the
          end. Which makes it a sort-of love letter to the creative process, and
          to the joys of pursing something purely for the “what-if” of it. There
          are so many ways that sticking with something can truly surprise you,
          and that doesn’t have to involve making weird music videos — it could
          be baking, or cross stitch, or learning a language, or dance. Things
          you can experiment with, be creative with, grow with. Things that make
          you feel like you did something you previously couldn’t. Maybe even
          something great. That might be the greatest feeling there is.
        </p>
        <p>
          I hope you find it inspiring, or at the very least, mildly
          interesting, and I appreciate you taking the time to learn more about
          how the project works.
        </p>
        <h1 id="okay-how-do-i-find-out-more">Okay, how do I find out more?</h1>
        <h1 id="🎨-📸">🎨 📸</h1>
        <p>
          If you’d like to check it out, you can do so here:
          <br />
          <a href="https://lysterfieldlake.com/">
            https://lysterfieldlake.com/
          </a>
        </p>
        <p>
          The project itself is entirely open-source, and available at the
          following GitHub repositories:
        </p>
        <h2 id="superhighfiveslysterfield-lake">
          <a href="https://github.com/superhighfives/lysterfield-lake">
            superhighfives/lysterfield-lake
          </a>
        </h2>
        <p>
          A React app, powered by React and{' '}
          <a href="https://docs.pmnd.rs/react-three-fiber/getting-started/introduction">
            react-three-fiber
          </a>
          .
        </p>
        <h2 id="superhighfiveslysterfield-lake-pipeline">
          <a href="https://github.com/superhighfives/lysterfield-lake-pipeline">
            superhighfives/lysterfield-lake-pipeline
          </a>
        </h2>
        <p>
          The pipeline that generates the video used by the app, powered by
          python and shell-scripts.
        </p>
        <blockquote>
          <p>
            <strong>Author’s note:</strong> Fair warning—it’s not the cleanest
            code, and in the case of the pipeline, it’s not something that will
            work locally out of the box. I definitely intended open-sourcing
            this to be educational, in the sense of “oh, that’s how he did
            that!”, as opposed to aspirational, like “oh, that’s how he thinks
            React should be written??” It was a passion project, so maybe bear
            that in mind. Cheers. 😅
          </p>
        </blockquote>
        <p>
          <img
            src="https://miro.medium.com/v2/resize:fit:1400/1*g397qfMgkYnXmrD7kYoN6w.jpeg"
            alt=""
          />
        </p>
        <p>The cover art for Lysterfield Lake.</p>
        <h2 id="🎵-🥁">🎵 🥁</h2>
        <p>
          If you’d like to check out my music, you can find Brightly here:
          <br />
          <a href="https://wearebrightly.com/">https://wearebrightly.com/</a>
        </p>
        <h2 id="💌-🥰">💌 🥰</h2>
        <p>
          If you’d like to share this project, that would be greatly
          appreciated.
        </p>
        <h2 id="🙏-👏">🙏 👏</h2>
        <p>
          Thanks to all my mates who came on country walks while I filmed myself
          awkwardly mouthing along to my own music. To Ian and Georgia for
          filming the real thing in Scotland. And to everyone who told me I’m
          not too old to keep making things.
        </p>
        <p>
          Also, this project wouldn’t have happened, like all my projects,
          without the support and encouragement of{' '}
          <a href="https://github.com/geelen">Glen Maddern</a>. ❤️
        </p>
        <p>
          Produced and Mixed by James Seymour in Naarm.
          <br />
          Mastered by Andrei “Ony” Eremin in Philadelphia.
        </p>
        <p>
          Thank you for listening.
          <br />
          <a href="http://twitter.com/wearebrightly">@wearebrightly</a> /
          wearebrightly.com
        </p>
      </div>
      <Footer user={user} />
    </Layout>
  )
}

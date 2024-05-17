import Block from '~/components/ui/events/block'
import Items from '~/components/ui/events/items'
import Item from '~/components/ui/events/item'
import Education from '~/components/ui/events/education'
import Grid from '~/components/ui/grid'

export default function Events() {
  return (
    <>
      {/* prettier-ignore */}
      <Grid className="grid-flow-row-dense">
        <Block wide id="awards-achievements" title="Awards &amp; Achievements">
            <Item added="1704231952628" date="2024" title="AWWWARDS, Nomination for Typography Honors" link={{title: "Lysterfield Lake", href: "https://www.awwwards.com/sites/lysterfield-lake"}} />
            <Item added="1703075047170" date="2023" title="AWWWARDS, Honourable Mention" link={{title: "Lysterfield Lake", href: "https://www.awwwards.com/sites/lysterfield-lake"}} />
            <Item added="1679399492577" date="2023" title="Salesforce TMP AI Hackathon, Winner for Overall Best Hack" />
            <Item added="1674581991506" date="2023" title="Product Hunt, Runner Up in the 2022 Golden Kitty Awards" link={{title: "Pika", href: "https://www.producthunt.com/posts/pika"}} />
            <Item date="2021" title="Product Hunt, Featured" link={{title: "Pika", href: "https://www.producthunt.com/posts/pika"}} />
            <Item date="2019" title="The Ink Award" link={{title: "Heroku Hanafuda Cards", href: "https://suminagame.com/2019/11/27/choboku-037/"}} />
            <Item date="2017" title="Typewolf, Site of the Day" link={{title: "Charlie Gleason", href: "https://www.typewolf.com/site-of-the-day/charlie-gleason"}} />
            <Item date="2016" title="The FWA, Site of the Day" link={{title: "Kōya", href: "https://thefwa.com/cases/koya"}} />
            <Item date="2016" title="AWWWARDS, Honourable Mention" link={{title: "Kōya", href: "https://www.awwwards.com/sites/koya"}} />
            <Item date="2016" title="Kickstarter, Projects We Love" link={{title: "One For Sorrow, Two For Joy", href: "https://www.kickstarter.com/projects/207221174/one-for-sorrow-two-for-joy-an-experiment-in-partic/"}} />
            <Item date="2016" title="The FWA, Site of the Day" link={{title: "Rugby", href: "https://thefwa.com/cases/rugby"}} />
            <Item date="2016" title="AWWWARDS, Honourable Mention" link={{title: "Rugby", href: "https://www.awwwards.com/sites/rugby"}} />
            <Item date="2015" title="The FWA, Site of the Day" link={{title: "I Will Never Let You Go", href: "https://thefwa.com/cases/i-will-never-let-you-go"}} />
            <Item date="2015" title="AWWWARDS, Honourable Mention" link={{title: "I Will Never Let You Go", href: "https://www.awwwards.com/sites/i-will-never-let-you-go"}} />
            <Item date="2015" title="Chrome Experiments" link={{title: "Tweetflight", href: "https://experiments.withgoogle.com/tweetflight"}} />
            <Item date="2014" title="Futurebook Innovation Awards, Best Publisher Website, Unbound" />
            <Item date="2013" title="Google Sandbox, Tweetflight" />
            <Item date="2013" title="The FWA, Site of the Day" link={{title: "Tweetflight", href: "https://thefwa.com/cases/tweetflight"}} />
            <Item date="2013" title="AWWWARDS, Site of the Day" link={{title: "Tweetflight", href: "https://www.awwwards.com/sites/tweetflight"}} />
            <Item date="2011" title="AWWWARDS, Site of the Day" link={{title: "The Story of Mick Roberts", href: "https://www.awwwards.com/sites/smoking-takes-lives"}} />
            <Item date="2011" title="Caples, Silver, Pop What You’re Not" />
            <Item date="2011" title="Award, Bronze, Pop What You’re Not" />
            <Item date="2010" title="AIMIA, Nomination for Effectiveness, Pop What You’re Not" />
            <Item date="2010" title="ADMA, Bronze for Art Direction / Craft, Pop What You’re Not" />
            <Item date="2010" title="ADMA, Silver for Automotive, Pop What You’re Not" />
            <Item date="2010" title="MADC, Bronze for Best Microsite, Pop What You’re Not" />
            <Item date="2007" title="Design Institute of Australia, Encouragement Award" />
        </Block>

        <Block id="talks-demos-workshops" title="Talks, Demos &amp; Workshops">
            <Item added="1715100373042" date="2024" title="Partner Summit: The Future of AppExchange" />
            <Item added="1694520000000" date="2023" title="Dreamforce: Designing a 5 Star Partner Listing" />
            <Item date="2019" title="Creative Coding London" />
            <Item date="2017" title="JSConf Budapest (Master of Ceremonies)" />
            <Item date="2016" title="Decompress: Blending WebGL and video" />
            <Item date="2012" title="Web Directions South: You are a developer, the internet is your friend" />
            <Item date="2012" title="What Do You Know: So, you are great (and so is Less CSS)" />
            <Item date="2011" title="What Do You Know: How to make your life more awesome with CSS3 media queries" />
        </Block>

        <Block id="education" title="Education">
          <Education title="Masters of Computer Science" school="RMIT University" location="Melbourne" dates="2011 - incomplete" />
          <Education title="Bachelor of Design (Multimedia Design)" school="Swinburne School of Design" location="Melbourne" dates="2004 - 2007" postscript="First Class Honours" />
        </Block>

        <Block id="certifications" title="Certifications">
            <Item date="2022" title="Salesforce User Experience (UX) Designer Certification" />
        </Block>

        <Block id="volunteering" title="Volunteering">
          <Items>
            <Item title="Samaritans" date="2020 - 2024" stack />
          </Items>
        </Block>

        <Block id="triathlons" title="Triathlons">
            <Item date="2023" title="Blenheim Palace Triathlon (Sprint)" />
            <Item date="2022" title="Blenheim Palace Triathlon (Sprint)" />
        </Block>
          
        <Block id="half-marathons" title="Half Marathons">
            <Item date="2022" title="Manchester Great Run" />
            <Item date="2021" title="London Landmarks" />
        </Block>
          
        <Block id="marathons" title="Marathons">
            <Item date="2017" title="London" />
            <Item date="2015" title="London" />
        </Block>

        <Block id="ultra-marathons" title="Ultra Marathons"> 
            <Item title="None" />
        </Block>    
      </Grid>
    </>
  )
}

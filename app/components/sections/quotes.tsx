import Grid from '~/components/ui/grid'
import Quote from '~/components/ui/quotes/quote'

export default function Quotes() {
  return (
    <Grid cols={8}>
      <Quote
        hero
        id="margaret"
        name="Margaret Francis"
        role="Former GM"
        company="Heroku / Salesforce"
      >
        <span className="opacity-40">“</span>
        <strong className="text-yellow-700 dark:text-yellow-500">
          Charlie is so gifted and productive.
        </strong>{' '}
        I would work with him again any day. It's been a great professional and
        personal pleasure to spend these last few years travelling in his
        company, and seeing the great beauty he's brought to the world through
        his work on Heroku. May we have the chance to do good things together
        again&nbsp;someday!<span className="opacity-40">”</span>
      </Quote>

      <Quote
        id="ashlyn"
        name="Ashlyn Watters"
        role="Product Architect"
        company="Salesforce"
      >
        <span className="opacity-40">“</span>
        <strong className="text-yellow-700 dark:text-yellow-500">
          Charlie is one of the most gifted, multi-skilled designers I have ever
          worked with.
        </strong>{' '}
        He's an amazing collaborator and teammate. Everything he touched made
        our work 1,000% better.<span className="opacity-40">”</span>
      </Quote>

      <Quote
        id="natalie"
        name="Natalie Malloy"
        role="Senior Director"
        company="Salesforce"
      >
        <span className="opacity-40">“</span>What impressed me the most was his
        attention to every detail, his professionalism, his leadership in this
        space, and also his empathy and kindness.{' '}
        <strong className="text-yellow-700 dark:text-yellow-500">
          Oh did I mention he is one fantastic designer?
        </strong>
        <span className="opacity-40">”</span>
      </Quote>

      <Quote id="john" name="John Barton" role="CTO" company="Amber Electric">
        <span className="opacity-40">“</span>Charlie’s nicer friends will say
        great things about his creativity and empathy, which is true, but not
        interesting. Charlie has hustle.{' '}
        <strong className="text-yellow-700 dark:text-yellow-500">
          He works and he works and he works, and that is how he got so good at
          what he&nbsp;does
        </strong>
        .<span className="opacity-40">”</span>
      </Quote>

      <Quote
        id="glen"
        name="Glen Maddern"
        role="Systems Engineer"
        company="Cloudflare"
      >
        <span className="opacity-40">“</span>
        <strong className="text-yellow-700 dark:text-yellow-500">
          Charlie has a formidable blend of talents
        </strong>
        : a grounded, empathetic design sense, an artist’s eye for subversion,
        and the tenacity to do whatever—and learn whatever—is necessary to
        ship&nbsp;projects.<span className="opacity-40">”</span>
      </Quote>

      <Quote
        id="will"
        name="Will Dayble"
        role="Co-founder"
        company="Squareweave"
      >
        <span className="opacity-40">“</span>Charlie has a{' '}
        <strong className="text-yellow-700 dark:text-yellow-500">
          unique, articulate, polished understanding of design
        </strong>
        , art and how people interact and care for one&nbsp;another.
        <span className="opacity-40">”</span>
      </Quote>

      <Quote
        id="vicky"
        name="Vicky Zeamer"
        role="Lead Researcher, Research & Insights"
        company="Salesforce"
      >
        <span className="opacity-40">“</span>
        <strong className="text-yellow-700 dark:text-yellow-500">
          Charlie is a supercharged teammate
        </strong>
        . When he is assigned to something, he carries it to the finish line. He has laser-focused attention to detail [and] no fear when it comes to dealing in ambiguous and new spaces.<span className="opacity-40">”</span>
      </Quote>

      <Quote
        id="olivia"
        name="Olivia Yu"
        role="Lead Designer"
        company="Salesforce"
      >
        <span className="opacity-40">“</span>
        [His] talent, humor, knowledge shares, thoughtfulness, storytelling, creative contributions,{' '}
        <strong className="text-yellow-700 dark:text-yellow-500">
          the list goes on!
        </strong>{' '}
          I'm grateful to have crossed paths.
        <span className="opacity-40">”</span>
      </Quote>

      <Quote
        id="bex"
        name="Becky Bolton"
        role="Former Developer"
        company="Unbound"
      >
        <span className="opacity-40">“</span>
        <strong className="text-yellow-700 dark:text-yellow-500">
          Charlie is a developer of exceptional talent
        </strong>
        . He is personable and fun, and these qualities made him universally
        loved by the team around&nbsp;him.<span className="opacity-40">”</span>
      </Quote>

      <Quote
        id="jg"
        name="John Geyer"
        role="Technical Writing Lead"
        company="Salesforce"
      >
        <span className="opacity-40">“</span>
        [Charlie is that] near-impossible combo of{' '}
        <strong className="text-yellow-700 dark:text-yellow-500">
        crazy talented and down-to-earth
        </strong>
        .<span className="opacity-40">”</span>
      </Quote>

    </Grid>
  )
}

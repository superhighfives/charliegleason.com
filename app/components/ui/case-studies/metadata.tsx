import { Fragment } from 'react'

export default function Metadata({gradient, metadata}: {gradient: string, metadata: []}) {
  return <div className="lg-sidebar row-auto not-prose space-y-4">
  <h3 className={`text-xs font-display uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${gradient} inline-block`}>
    Project Metadata
  </h3>
  <dl className="grid justify-start grid-cols-6 gap-y-4">
    {metadata.map(
      (data: { name: string; content: string | [] }) => {
        const classes = "text-sm space-y-2 col-span-full sm:col-span-4 lg:col-span-4 sm:border-t sm:pt-4"
        return (
          <Fragment key={data.name}>
            <dt className="font-mono text-xs col-span-full sm:col-span-2 lg:col-span-2 border-t pt-4">{data.name}</dt>
            {Array.isArray(data.content)
            ? <div className={`${classes}`}>
              {data.content.map(row => <dd key={row} className="first-line:font-medium">{(row as []).map(line => <p key={line}>{line}</p>)}</dd>)}
              </div>
            : <dd className={classes}>{data.content}</dd>}
          </Fragment>
        )
      }
    )}
  </dl>
</div>
}

export default function Metadata({gradient, metadata}: {gradient: string, metadata: []}) {
  return <div className="lg-sidebar not-prose space-y-4">
  <h3 className={`text-xs font-display uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${gradient} inline-block`}>
    Project Metadata
  </h3>
  <dl className="grid justify-start grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-4">
    {metadata.map(
      (data: { name: string; content: string | [] }) => {
        const classes = "text-sm"
        return (
            Array.isArray(data.content)
            ? <div className="border-b-2 dark:border-neutral-700 col-span-2" key={data.name}>
              <dt className="font-mono text-xs col-span-full pb-2 text-neutral-400">{data.name}</dt>
              <div className={`${classes} col-span-2 grid grid-cols-2 gap-4 pb-4`}>
                {data.content.map(row => <dd key={row} className="col-span-1 first-line:font-medium">{(row as []).map(line => <p key={line}>{line}</p>)}</dd>)}
              </div>
            </div>
            : <div className="border-b-2 dark:border-neutral-700 col-span-1" key={data.name}>
              <dt className="font-mono text-xs pb-2 text-neutral-400">{data.name}</dt>
              <dd className={`${classes} col-span-full pb-4`}>{data.content}</dd>
            </div>
        )
      }
    )}
  </dl>
</div>
}

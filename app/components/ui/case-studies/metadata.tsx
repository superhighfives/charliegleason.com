export default function Metadata({gradient, metadata}: {gradient: string, metadata: []}) {
  return <div className="lg-sidebar not-prose space-y-4">
  <h3 className={`text-xs font-display uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r ${gradient} inline-block`}>
    Project Metadata
  </h3>
  <dl className="grid justify-start grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-4">
    {metadata.map(
      (data: { name: string; content: string | [] }) => {
        const classes = "text-sm col-span-full"
        return (
            Array.isArray(data.content)
            ? <div className="xl:border-b dark:border-neutral-700 col-span-full" key={data.name}>
              <dt className="font-mono text-xs col-span-full pt-2 pb-4">{data.name}</dt>
              <div className={`${classes} grid grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-4 pb-6`}>
                {data.content.map(row => <dd key={row} className="col-span-1 first-line:font-medium">{(row as []).map(line => <p key={line}>{line}</p>)}</dd>)}
              </div>
            </div>
            : <div className="border-b dark:border-neutral-700 col-span-full sm:col-span-1" key={data.name}>
              <dt className="font-mono text-xs col-span-full pb-2">{data.name}</dt>
              <dd className={`${classes} pb-4`}>{data.content}</dd>
            </div>
        )
      }
    )}
  </dl>
</div>
}

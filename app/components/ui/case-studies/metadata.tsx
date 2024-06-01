export default function Metadata({gradient, metadata}: {gradient: string, metadata: []}) {
  return <div className="lg-sidebar not-prose space-y-4">
  <h3 className={`text-xs font-display uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-l ${gradient} inline-block`}>
    Project Metadata
  </h3>
  <dl className="grid justify-start grid-cols-2 md:grid-cols-4 xl:grid-cols-2 gap-4">
    {metadata.map(
      (data: { name: string; content: string | [] }) => {
        const classes = "text-sm"
        return (
            Array.isArray(data.content)
            ? data.content.map((item: any) => {
              return (
                <div className={`relative border-b-2 border-transparent col-span-1 before:block before:content-[''] before:absolute before:left-0 before:bottom-0 before:right-0 before:h-[2px] before:bg-gradient-to-r ${gradient} before:from-inherit before:to-inherit before:[background-size:2000px] before:bg-left
            }`} key={item[0]}>
                  <dt className={`font-mono text-xs col-span-full pb-2 text-transparent bg-clip-text bg-white bg-gradient-to-r ${gradient} [background-size:2000px] before:bg-left`}>{item[1]}</dt>
                  <dd className={`${classes} col-span-full pb-4`}>{item[0]}</dd>
                </div>
              )
            })
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

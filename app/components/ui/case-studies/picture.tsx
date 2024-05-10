export default function Picture({
  src,
  alt,
  themed = false,
}: {
  src: string
  alt: string
  themed: boolean
}) {
  const file = src.split('.')
  const url = file.join(themed ? '-dark.' : '.')
  return (
    <figure className="text-center space-y-2 font-mono text-gray-600 text-xs">
      <img className="rounded mx-auto w-full" src={url} alt={alt} />
      <figcaption className="max-w-lg mx-auto">{alt}</figcaption>
    </figure>
  )
}

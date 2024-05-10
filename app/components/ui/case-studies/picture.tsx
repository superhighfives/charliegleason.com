
export default function Picture({src, alt}: {src: string, alt: string}) {
  return (
    <figure className="text-center space-y-2 font-mono text-gray-600 text-xs">
      <img className="rounded mx-auto w-full" src={src} alt={alt} />
      <figcaption className="max-w-lg mx-auto">{alt}</figcaption>
    </figure>
  )
}

export default function Picture({
  src,
  alt,
  themed = false,
}: {
  src: string
  alt: string
  themed: boolean
}) {
  const lightSrc = src
  const darkSrc = src.split('.').join(themed ? '-dark.' : '.')
  return (
    <figure className="text-center space-y-2 font-mono text-gray-600 text-xs">
      <img
        className={`${
          themed ? 'dark:hidden' : ''
        } block rounded mx-auto w-full`}
        src={lightSrc}
        alt={alt}
      />
      {themed ? (
        <img
          className={`${
            themed ? 'hidden dark:block' : ''
          } rounded mx-auto w-full`}
          src={darkSrc}
          alt={alt}
        />
      ) : null}
      <figcaption className="max-w-lg mx-auto">{alt}</figcaption>
    </figure>
  )
}

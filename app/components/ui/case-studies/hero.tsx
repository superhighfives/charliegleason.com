export default function Metadata({
  gradient,
  hero,
}: {
  gradient: string
  hero: string
}) {
  return (
    <div className="space-y-8">
      <div className={`h-2 bg-gradient-to-r ${gradient} rounded-full relative top-3.5`} />
      <p className="text-xl font-medium sm:text-3xl leading-relaxed dark:text-white">
        {hero}
      </p>
    </div>
  )
}

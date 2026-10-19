import type { LatestRecords } from "../../lib/records";

interface RecordsProps {
  records?: LatestRecords;
  endpoint: string;
}

export default function Records({ records, endpoint }: RecordsProps) {
  // Hide section if records fail to load
  if (!records?.length) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="tracking-widest text-xs font-display uppercase text-yellow-700 dark:text-yellow-500">
          Recent records{" "}
          <a
            href={endpoint}
            className="font-mono font-bold text-[0.625rem] transition-colors border-b border-neutral-900/25 dark:border-neutral-100/25 hover:text-yellow-600 dark:hover:text-yellow-400 hover:border-current"
          >
            (records.charliegleason.com)
          </a>
        </h2>
      </div>
      {/* Stacked: 3 on mobile; a 2 × 2 grid from sm up */}
      <div className="grid gap-4 sm:grid-cols-2">
        {records.map((record, index) => (
          <a
            key={record.id}
            href={record.url}
            className={`group gap-3 text-sm transition-colors hover:text-yellow-600 dark:hover:text-yellow-400 ${
              index < 3 ? "flex" : "hidden sm:flex"
            }`}
          >
            {record.imageUrl && (
              <img
                src={record.imageUrl}
                alt=""
                className="w-12 h-12 rounded-md object-cover shrink-0 shadow-md"
                loading="lazy"
              />
            )}
            <div className="flex items-start flex-col gap-1 flex-1 max-w-full min-w-0">
              <span className="max-w-full underline underline-offset-4 text-pretty decoration-neutral-900/25 dark:decoration-neutral-100/25 group-hover:decoration-current transition-colors">
                {record.title}
              </span>
              <p className="text-xs text-pretty text-neutral-600 dark:text-neutral-400 max-w-full">
                {record.artist}
                {record.year && ` · ${record.year}`}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

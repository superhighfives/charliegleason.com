import {
  FEED_IMAGE_CLASS,
  FEED_LINK_CLASS,
  FEED_TITLE_CLASS,
  tilt,
} from "../../lib/feed";
import type { LatestRecords } from "../../lib/records";
import SourceLink from "../ui/SourceLink";

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
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="tracking-widest text-xs font-display uppercase text-yellow-700 dark:text-yellow-500">
          Recent records{" "}
          <SourceLink href={endpoint} label="records.charliegleason.com" />
        </h2>
      </div>
      <div className="grid gap-4">
        {records.map((record) => (
          <a
            key={record.id}
            href={record.url}
            className={`${FEED_LINK_CLASS} text-sm`}
          >
            {record.imageUrl && (
              <img
                src={record.imageUrl}
                alt=""
                className={`${FEED_IMAGE_CLASS} rounded-md shadow-md`}
                style={tilt(record.title)}
                loading="lazy"
              />
            )}
            <div className="flex items-start flex-col gap-1 flex-1 max-w-full min-w-0">
              <span className="block">
                <span className={FEED_TITLE_CLASS}>{record.title}</span>
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

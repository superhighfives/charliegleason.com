interface SourceLinkProps {
  href: string;
  /** The site's domain, shown in the tooltip and read out by screen readers */
  label: string;
}

/**
 * The ↗ after a feed's heading, linking to where the feed comes from. Its
 * domain shows in a tooltip on hover or keyboard focus.
 */
export default function SourceLink({ href, label }: SourceLinkProps) {
  return (
    <a
      href={href}
      className="group/source relative inline-flex -my-0.5 px-1 py-0.5 rounded outline-none transition-colors hover:text-yellow-600 dark:hover:text-yellow-400 focus-visible:bg-yellow-300 focus-visible:text-yellow-900 dark:focus-visible:bg-yellow-300 dark:focus-visible:text-yellow-900"
    >
      <span
        aria-hidden="true"
        className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out group-hover/source:translate-x-px group-hover/source:-translate-y-px group-focus-visible/source:translate-x-px group-focus-visible/source:-translate-y-px"
      >
        ↗
      </span>
      {/* Also the link's name for screen readers, which read it even unseen */}
      <span className="pointer-events-none absolute left-1/2 bottom-full mb-1.5 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-yellow-300 px-2 py-1 font-mono text-[0.625rem] normal-case tracking-normal text-yellow-900 opacity-0 shadow-md motion-safe:transition-[opacity,transform] motion-safe:duration-150 motion-safe:ease-out group-hover/source:translate-y-0 group-hover/source:opacity-100 group-focus-visible/source:translate-y-0 group-focus-visible/source:opacity-100">
        {label}
      </span>
    </a>
  );
}

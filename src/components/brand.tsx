import Link from "next/link";

type BrandProps = {
  className?: string;
  compact?: boolean;
};

export function Brand({ className = "", compact = false }: BrandProps) {
  return (
    <Link className={`brand ${className}`.trim()} href="/" aria-label="Digital Visions home">
      <svg className="brand-symbol" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M3 23.5V15h7v8.5H3Z" fill="currentColor" />
        <path d="M12.5 23.5V9h7v14.5h-7Z" fill="currentColor" opacity=".78" />
        <path d="M22 23.5V3h7v20.5h-7Z" fill="currentColor" opacity=".48" />
      </svg>
      {!compact && <span>digital <strong>vision</strong></span>}
    </Link>
  );
}
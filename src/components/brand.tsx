import Image from "next/image";

export function Brand({
  product = false,
  light = false,
}: {
  product?: boolean;
  light?: boolean;
}) {
  const asset = product
    ? light
      ? "Asset 15@4x-8.png"
      : "Asset 14@4x-8.png"
    : light
      ? "Asset 9@4x-8.png"
      : "Asset 8@4x-8.png";
  return (
    <span
      className={`brand ${product ? "brand--product" : ""} ${light ? "brand--light" : ""}`}
    >
      <Image
        src={`/brand/${asset}`}
        width={product ? 3586 : 5215}
        height={product ? 585 : 563}
        alt={product ? "GoChauffeur" : "Go Technologies"}
        unoptimized
        loading={light || product ? "lazy" : "eager"}
      />
    </span>
  );
}

export function GoMark({ className = "" }: { className?: string }) {
  return <span className={`go-mark ${className}`} aria-hidden="true" />;
}

export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {diagonal ? (
        <path d="M5 19 19 5M5 5h14v14" />
      ) : (
        <path d="M4 12h16m-7-7 7 7-7 7" />
      )}
    </svg>
  );
}

export function Action({
  children,
  href,
  secondary = false,
  className = "",
}: {
  children: React.ReactNode;
  href: string;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <a
      className={`action ${secondary ? "action--secondary" : ""} ${className}`}
      href={href}
    >
      <span>{children}</span>
      <span className="action-icon">
        <Arrow diagonal />
      </span>
    </a>
  );
}

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

const sizes = {
  sm: 20,
  md: 24,
  lg: 32,
};

export default function Logo({ size = "md", showText = true, href = "/", className = "" }: LogoProps) {
  const px = sizes[size];

  const content = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="InpromptiFy"
        width={px}
        height={px}
        className="shrink-0"
        priority
      />
      {showText && (
        <span className={`font-semibold text-white ${size === "lg" ? "text-lg" : size === "sm" ? "text-sm" : "text-base"}`}>
          InpromptiFy
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}

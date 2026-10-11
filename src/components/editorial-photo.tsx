import Image from "next/image";

type Photo = "contractor-estimate" | "plans-and-tools" | "framing-crew";

export function EditorialPhoto({
  photo,
  alt,
  className = "",
  eager = false,
}: {
  photo: Photo;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    <picture className={`editorial-photo ${className}`}>
      <source
        srcSet={`/images/${photo}-768.webp 768w, /images/${photo}-1536.webp 1536w`}
        sizes={
          photo === "contractor-estimate"
            ? "(max-width: 700px) 600px, 800px"
            : "(max-width: 700px) 100vw, 600px"
        }
        type="image/webp"
      />
      <Image
        src={`/images/${photo}-1536.webp`}
        alt={alt}
        width={1536}
        height={1024}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
      />
    </picture>
  );
}

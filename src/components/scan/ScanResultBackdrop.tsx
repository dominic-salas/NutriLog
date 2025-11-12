import Image from "next/image";

interface ScanResultBackdropProps {
  imageUrl: string;
  alt: string;
}

export function ScanResultBackdrop({ imageUrl, alt }: ScanResultBackdropProps) {
  return (
    <>
      <div className="absolute inset-0">
        <Image src={imageUrl} alt={alt} fill className="object-cover opacity-30" priority />
      </div>
      <div className="absolute inset-0 bg-black/70" />
    </>
  );
}


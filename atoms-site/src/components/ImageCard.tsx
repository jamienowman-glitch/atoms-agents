import Link from "next/link";
import Image from "next/image";

interface ImageCardProps {
    src: string;
    alt: string;
    label: string;
    href: string;
}

export default function ImageCard({ src, alt, label, href }: ImageCardProps) {
    return (
        <Link href={href} className="group block relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-900">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
            </div>
            <div className="absolute bottom-4 left-4">
                <span className="text-white font-bold uppercase tracking-widest text-lg border-b-2 border-transparent group-hover:border-white transition-all">
                    {label}
                </span>
            </div>
        </Link>
    );
}

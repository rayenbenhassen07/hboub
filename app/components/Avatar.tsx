'use client';

import Image from "next/image";

interface AvatrProps{
    src?: string | null | undefined;
    width?: number;
    height?: number;
}

const Avatar : React.FC<AvatrProps> = ({
    src,
    width,
    height

}) => {
  return (
    <Image
        className="rounded-full"
        height={width}
        width={height}
        alt="Avatar"
        src={src || "/images/avatar.png"}
    
    />
  )
}

export default Avatar
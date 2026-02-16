import Image from "next/image";

export default function Header() {
  return (
    <header>
      <Image
        src="/bird_2.jpg"
        alt="bird"
        width={150}
        height={80}
      />
    </header>
  );
}

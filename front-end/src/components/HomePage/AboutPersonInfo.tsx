import { Space_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

export default function AboutPersonInfo(prop: any) {
  return (
    <div className="flex items-center justify-center gap-4 flex-col">
      <h3 className={`${mono.className} text-center text-[16px] `}>
        Full Stack
      </h3>
      <Image
        src={`${prop.Picture}`}
        alt="profile picture"
        height={120}
        width={120}
        className="rounded-full"
      />
      <div className="flex items-center justify-center gap-2">
        <Link href={`${prop.TwitterLink}`} target="_blank">
          <Image
            src="/IconTwitter.png"
            alt="githubicon"
            height={30}
            width={30}
          />
        </Link>
        <Link href={`${prop.LinkedinLink}`} target="_blank">
          <Image
            src="/IconLinkedin.png"
            alt="githubicon"
            height={30}
            width={30}
          />
        </Link>
        <Link href={`${prop.GithubLink}`} target="_blank">
          <Image
            src="/IconGithub.png"
            alt="githubicon"
            height={30}
            width={30}
          />
        </Link>
      </div>
    </div>
  );
}

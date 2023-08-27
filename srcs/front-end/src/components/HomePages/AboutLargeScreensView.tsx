import { Press_Start_2P } from "next/font/google";
import { Space_Mono } from "next/font/google";
import AboutPersonInfo from "./AboutPersonInfo";

const pixelfont = Press_Start_2P({
  subsets: ["latin"],
  weight: ["400"],
});

const mono = Space_Mono({
  subsets: ["latin"],
  style: ["normal"],
  weight: ["400", "700"],
});

export default function AboutLargeScreensView() {
  return (
    <div className="2xl:flex hidden items-center justify-normal flex-col  text-white p-[5%] w-full h-full overflow-auto">
      <div className="flex items-center justify-between gap-16 w-full my-[50px] h-1/2">
        <p className={`${mono.className} text-[16px]  w-8/12`}>
          The project "ft_transcendence" is a website creation project focused
          on implementing a multiplayer online game of Pong. The website
          provides a user-friendly interface, a chat feature, and real-time
          gameplay. The project has specific requirements, such as using NestJS
          for the backend, a TypeScript framework for the frontend, and a
          PostgreSQL database. Security concerns, including password hashing and
          protection against SQL injections, must be addressed. User accounts
          involve login through the OAuth system of 42 intranet, profile
          customization, two-factor authentication, friend management, and
          displaying user stats. The chat feature includes channel creation,
          direct messaging, blocking users, and game invitations. The game
          itself should be a faithful representation of the original Pong, with
          customization options and responsiveness to network issues. The
          project submission and evaluation process follow the standard Git
          repository workflow.
        </p>
        <h2 className={`text-[80px] ${pixelfont.className}`}>About</h2>
      </div>
      <div className="flex items-center justify-between  gap-8 w-full my-[50px] min-h-[250px]">
        <h2 className={`text-[80px] ${pixelfont.className}`}>Team</h2>
        <div className="flex items-center justify-between gap-24 w-8/12">
          <AboutPersonInfo
            Picture="/Abdellah.jpg"
            TwitterLink="https://twitter.com/withabdellah"
            LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
            GithubLink="https://www.github.com/AbdellahBellakrim"
          />
          <AboutPersonInfo
            Picture="/Abdellah.jpg"
            TwitterLink="https://twitter.com/withabdellah"
            LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
            GithubLink="https://www.github.com/AbdellahBellakrim"
          />
          <AboutPersonInfo
            Picture="/Abdellah.jpg"
            TwitterLink="https://twitter.com/withabdellah"
            LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
            GithubLink="https://www.github.com/AbdellahBellakrim"
          />
          <AboutPersonInfo
            Picture="/Abdellah.jpg"
            TwitterLink="https://twitter.com/withabdellah"
            LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233"
            GithubLink="https://www.github.com/AbdellahBellakrim"
          />
        </div>
      </div>
    </div>
  );
}

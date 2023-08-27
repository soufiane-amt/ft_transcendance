import { Press_Start_2P } from "next/font/google";
import { Space_Mono } from "next/font/google";
import AboutPersonInfo from "./AboutPersonInfo";



const pixelfont = Press_Start_2P({
    subsets: ['latin'],
    weight: ['400'],
  });


const mono = Space_Mono({
    subsets: ['latin'],
    style: ['normal'],
    weight: ['400', '700'],
})


export default function AboutMediumScreensView() {
    return (
        <div className="sm:max-2xl:flex hidden  items-center flex-col gap-8 p-[5%] text-white overflow-auto justify-betwen h-full w-full">
                <h2 className={`text-[30px] ${pixelfont.className} m-[5%]`}>About</h2>
                <p className={`${mono.className} text-center text-[13px]`}>
                    The project "ft_transcendence" is a website creation project focused on implementing a multiplayer online game of Pong.
                    The website provides a user-friendly interface, a chat feature, and real-time gameplay.
                    The project has specific requirements, such as using NestJS for the backend, a TypeScript framework for the frontend, and a PostgreSQL database.
                    Security concerns, including password hashing and protection against SQL injections, must be addressed.
                    User accounts involve login through the OAuth system of 42 intranet, profile customization, two-factor authentication, friend management, and displaying user stats.
                    The chat feature includes channel creation, direct messaging, blocking users, and game invitations.
                    The game itself should be a faithful representation of the original Pong, with customization options and responsiveness to network issues.
                    The project submission and evaluation process follow the standard Git repository workflow.
                </p>
                <h2 className={`text-[30px] ${pixelfont.className} m-[5%]`}>Team</h2>
                <div className="flex items-center flex-col w-full">
                    <div className="flex items-center justify-evenly  min-h-1/2 w-full my-[35px]">
                        <AboutPersonInfo Picture="/Abdellah.jpg" TwitterLink="https://twitter.com/withabdellah" LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233" GithubLink="https://www.github.com/AbdellahBellakrim"/>
                        <AboutPersonInfo Picture="/Abdellah.jpg" TwitterLink="https://twitter.com/withabdellah" LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233" GithubLink="https://www.github.com/AbdellahBellakrim"/>
                    </div>
                    <div  className="flex items-center justify-evenly min-h-1/2 w-full my-[35px]">
                        <AboutPersonInfo Picture="/Abdellah.jpg" TwitterLink="https://twitter.com/withabdellah" LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233" GithubLink="https://www.github.com/AbdellahBellakrim"/>
                        <AboutPersonInfo Picture="/Abdellah.jpg" TwitterLink="https://twitter.com/withabdellah" LinkedinLink="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233" GithubLink="https://www.github.com/AbdellahBellakrim"/>
                    </div>
                </div>
        </div>
    );
}

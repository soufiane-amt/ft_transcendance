import { Press_Start_2P } from "next/font/google";
import { Space_Mono } from "next/font/google";
import Image from "next/image";
import Link from 'next/link'



const pixelfont = Press_Start_2P({
    subsets: ['latin'],
    weight: ['400'],
  });


const mono = Space_Mono({
    subsets: ['latin'],
    style: ['normal'],
    weight: ['400', '700'],
})


export default function AboutLargeScreensView() {
    return (
        <div className="max-lg:hidden flex items-center justify-around flex-col  text-white p-[5%] w-full h-full gap-16">

            <div className="flex items-center justify-between gap-16">
                <p className={`${mono.className} text-[13px] font-bold`}>
                    The project "ft_transcendence" is a website creation project focused on implementing a multiplayer online game of Pong.
                    The website provides a user-friendly interface, a chat feature, and real-time gameplay.
                    The project has specific requirements, such as using NestJS for the backend, a TypeScript framework for the frontend, and a PostgreSQL database.
                    Security concerns, including password hashing and protection against SQL injections, must be addressed.
                    User accounts involve login through the OAuth system of 42 intranet, profile customization, two-factor authentication, friend management, and displaying user stats.
                    The chat feature includes channel creation, direct messaging, blocking users, and game invitations.
                    The game itself should be a faithful representation of the original Pong, with customization options and responsiveness to network issues.
                    The project submission and evaluation process follow the standard Git repository workflow.
                </p>
                <h2 className={`text-[45px] ${pixelfont.className}`}>About</h2>
            </div>



            
            <div className="flex items-center justify-between  gap-8 w-full">
                <h2 className={`text-[45px] ${pixelfont.className}`}>Team</h2>
                <div className="flex items-center justify-between gap-24">
                    <div className="flex items-center justify-center gap-4 flex-col">
                        <h3 className={`${mono.className} text-center text-[16px] `}>Full Stack</h3>
                        <Image src="/Abdellah.jpg" alt="profile picture" height={150} width={150} className="rounded-full"/>
                        <div className="flex items-center justify-center gap-6">
                            <Link href="https://twitter.com/withabdellah" target="_blank">
                                <Image src="/IconTwitter.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                            <Link href="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233" target="_blank">
                                <Image src="/IconLinkedin.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                            <Link href="https://www.github.com/AbdellahBellakrim" target="_blank">
                                <Image src="/IconGithub.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                        </div>
                    </div>    
                    <div className="flex items-center justify-center gap-4 flex-col">
                        <h3 className={`${mono.className} text-center text-[16px] `}>Full Stack</h3>
                        <Image src="/Abdellah.jpg" alt="profile picture" height={150} width={150} className="rounded-full"/>
                        <div className="flex items-center justify-center gap-6">
                            <Link href="https://twitter.com/withabdellah" target="_blank">
                                <Image src="/IconTwitter.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                            <Link href="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233" target="_blank">
                                <Image src="/IconLinkedin.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                            <Link href="https://www.github.com/AbdellahBellakrim" target="_blank">
                                <Image src="/IconGithub.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 flex-col">
                        <h3 className={`${mono.className} text-center text-[16px] `}>Full Stack</h3>
                        <Image src="/Abdellah.jpg" alt="profile picture" height={150} width={150} className="rounded-full"/>
                        <div className="flex items-center justify-center gap-6">
                            <Link href="https://twitter.com/withabdellah" target="_blank">
                                <Image src="/IconTwitter.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                            <Link href="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233" target="_blank">
                                <Image src="/IconLinkedin.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                            <Link href="https://www.github.com/AbdellahBellakrim" target="_blank">
                                <Image src="/IconGithub.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                        </div>
                    </div>      
                    <div className="flex items-center justify-center gap-4 flex-col">
                        <h3 className={`${mono.className} text-center text-[16px] `}>Full Stack</h3>
                        <Image src="/Abdellah.jpg" alt="profile picture" height={150} width={150} className="rounded-full"/>
                        <div className="flex items-center justify-center gap-6">
                            <Link href="https://twitter.com/withabdellah" target="_blank">
                                <Image src="/IconTwitter.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                            <Link href="https://www.linkedin.com/in/abdellah-bellakrim-0027b6233" target="_blank">
                                <Image src="/IconLinkedin.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                            <Link href="https://www.github.com/AbdellahBellakrim" target="_blank">
                                <Image src="/IconGithub.png" alt="githubicon" height={40} width={40}/>
                            </Link>
                        </div>
                    </div>      
                </div>

            </div>
        </div>
    );
}
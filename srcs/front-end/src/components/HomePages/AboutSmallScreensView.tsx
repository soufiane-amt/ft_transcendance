export default function AboutSmallScreensView() {
    return (
        <div className="sm:lg:hidden flex justify-evenly items-center p-[3%] text-white overflow-scroll">
            <div>
                <h2>About</h2>
                <p>
                The project "ft_transcendence" is a website creation project focused on implementing a multiplayer online game of Pong.
                The website provides a user-friendly interface, a chat feature, and real-time gameplay.
                The project has specific requirements, such as using NestJS for the backend, a TypeScript framework for the frontend, and a PostgreSQL database.
                Security concerns, including password hashing and protection against SQL injections, must be addressed.
                User accounts involve login through the OAuth system of 42 intranet, profile customization, two-factor authentication, friend management, and displaying user stats.
                The chat feature includes channel creation, direct messaging, blocking users, and game invitations.
                The game itself should be a faithful representation of the original Pong, with customization options and responsiveness to network issues.
                The project submission and evaluation process follow the standard Git repository workflow.
                </p>
            </div>
        </div>
    );
}
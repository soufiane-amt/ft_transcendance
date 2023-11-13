export default interface GameStatistics {
    user_username: string;
    user_avatar: string;
    opponent_username: string;
    opponent_avatar: string;
    gameId: string;
    result: string;
    createdAt: Date;
}
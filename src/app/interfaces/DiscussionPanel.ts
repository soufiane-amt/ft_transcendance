/*This interface presents the minimal message data that DiscussionDto needs for it to operate */
interface MessageMinData {
  content: string;
  timestamp: Date;
}

export interface DiscussionDto {
  id: string;
  user_id: string;
  username: string;
  avatar: string;
  last_message?: MessageMinData;
}

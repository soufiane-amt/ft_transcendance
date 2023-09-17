/*This interface presents the minimal message data that DiscussionDto needs for it to operate */
interface MessageMinData {
  content: string;
  timestamp: Date;
}

export interface DiscussionDto {
  id: string;
  room_name: string;
  user_id: string;
  avatar: string;
  last_message?: MessageMinData;
}

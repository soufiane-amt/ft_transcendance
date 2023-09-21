/*This interface presents the minimal message data that DiscussionDto needs for it to operate */
interface MessageDto {
  id: string;
  content: string;
  createdAt: string;
  is_read?: boolean;
}

export interface DiscussionDto {
  id: string;
  partner_id: string;
  last_message: MessageDto;
}


export interface discussionPanelSelectType {
  id: string;
  partner_id: string;
  last_message: { id:string, content: string, createdAt: string }
}
export interface selectDiscStateType {
  selectedDiscussion : discussionPanelSelectType,
  setDiscussion : (discussion: DiscussionDto) => void;
}

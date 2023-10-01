/*This interface presents the minimal message data that DiscussionDto needs for it to operate */
export interface MinMessageDto {
  id: string;
  content: string;
  createdAt: string;
  is_read?: boolean;
}

export interface DiscussionDto {
  id: string;
  partner_id: string  | undefined;
  last_message: MinMessageDto;
  unread_messages:number;
}


export interface discussionPanelSelectType {
  id: string;
  partner_id: string | undefined;
  last_message: { id:string, content: string, createdAt: string }
}
export interface selectDiscStateType {
  selectedDiscussion : discussionPanelSelectType,
  setSelectedDiscussion : (e: discussionPanelSelectType) => void
}

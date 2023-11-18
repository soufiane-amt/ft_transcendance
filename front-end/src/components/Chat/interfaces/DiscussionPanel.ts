/*This interface presents the minimal message data that DiscussionDto needs for it to operate */
export interface MinMessageDto {
  id: string;
  content: string;
  createdAt: string;
  is_read?: boolean;
}



export interface discussionPanelSelectType {
  id: string;
  partner_id: string | undefined;
}


export interface DiscussionDto extends discussionPanelSelectType {
  last_message: { id:string, content: string, createdAt: string }
  unread_messages:number;
}

export interface selectDiscStateType {
  selectedDiscussion : discussionPanelSelectType,
  setSelectedDiscussion : (e: discussionPanelSelectType) => void
}

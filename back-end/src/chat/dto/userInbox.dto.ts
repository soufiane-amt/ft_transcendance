
export interface inboxPacketDto
{
    sender_id : string
    inbox_id : string
    type: 'Dm_Invitation' | 'Other'
    roomToJoin? : string
}


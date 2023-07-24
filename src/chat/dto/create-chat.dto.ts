export interface CreateMessageDto 
{
    send_id :string
    created_at : Date
    channel_id : string
    content : string
    is_read : boolean
}

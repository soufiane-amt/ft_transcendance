export interface CreateMessageDto 
{
    user_id :string    
    created_at : Date
    channel_id : string
    content : string
    is_read : boolean
}

export interface channelDto
{
    type :   'PUBLIC' | 'PRIVATE' | 'PROTECTED';
    name : string;
    image : string;
    password? :string;
}

export interface channelMembershipDto
{
    channel_id :string;
    user_id :string;
    role :   'OWNER' | 'ADMIN' | 'USER';
    banned_at? :string;
}

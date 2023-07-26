export interface CreateMessageDto 
{
    user_id :string    
    channel_id : string
    content : string
    created_at? : Date
    is_read? : boolean
}

export interface channelDto
{
    type :   'PUBLIC' | 'PRIVATE' | 'PROTECTED';
    name : string;
    image : string;
    password? :string;
}


export interface dmDto
{
    user1_id :string;
    user2_id :string;
    status : 'ALLOWED' | 'BANNED';
}


export interface channelMembershipDto
{
    channel_id :string;
    user_id :string;
    role :   'OWNER' | 'ADMIN' | 'USER';
    banned_at? :string;
}

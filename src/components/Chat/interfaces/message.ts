interface messageDto {
    id:string
    user_id :string  
    dm_id? : string
    channel_id? : string
    content : string
    createdAt : string
    is_read? : boolean
}
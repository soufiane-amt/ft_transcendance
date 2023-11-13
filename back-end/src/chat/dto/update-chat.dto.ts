import { channelMembershipDto } from './chat.dto';

export interface UpdateChannelDto  {
  channel_id :string
  type: "PUBLIC" | "PRIVATE" | "PROTECTED";
  password?: string;
}

export interface UpdateUserMemberShip extends channelMembershipDto
{
  updater_id :string
}

export interface UserRoleSignal{
  targeted_username: string
  channel_id :string
}
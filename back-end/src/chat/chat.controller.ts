import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Param,
  Inject,
  UseGuards,
  Body,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request, Response, response } from 'express';
import { dmGateway } from './services/direct-messaging/dm.gateway';
import { allowJoinGuard } from './guards/chat.guards';
import { channelMembershipDto, dmDto } from './dto/chat.dto';
import { Reflector } from '@nestjs/core';
import { ChatCrudService } from 'src/prisma/chat-crud.service';
import * as path from 'path';
import * as fs from 'fs';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-aut.guard';

@Controller('chat')
// @UseGuards(cookieGuard)
export class ChatController {
  constructor(
    private readonly authservice: AuthService,
    private readonly chatCrud: ChatCrudService,
    private readonly userCrud: UserCrudService,

    @Inject(dmGateway) private readonly dmGate: dmGateway,
    private readonly reflector: Reflector,
  ) {}

  private currentUserId(request: Request) {
    const JwtToken: string = request.headers.authorization.split(' ')[1];
    const payload: any = this.authservice.extractPayload(JwtToken);

    return payload.userId;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/image/:image_path')
  async getUserImage(
    @Param('image_path') image_path: string,
    @Res() res: Response,
  ) {
    const imagePath = path.join(__dirname, '..', `../uploads/${image_path}`); // Go up two directories to reach the workspace root
    if (!fs.existsSync(imagePath)) {
      return res.status(404).send('Image not found');
    }
    res.sendFile(imagePath);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/Direct_messaging/discussionsBar')
  async findAllDiscussionPartners(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);

    const dms = await this.chatCrud.retreiveDmInitPanelData(currentUserId);
    const unreadMessagesPromises = dms.map(async (dmElement) => {
      const unreadMessages = await this.chatCrud.getUnreadDmMessagesNumber(
        currentUserId,
        dmElement.id,
      ); //get the number of messages unread and unsent by this user
      return { ...dmElement, unread_messages: unreadMessages };
    });

    // I wait for all promises to resolve
    const discussions = await Promise.all(unreadMessagesPromises);
    return discussions;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/Channels/discussionsBar')
  async findAllDiscussionChannels(@Req() request: Request) {
    try {
      const currentUserId = this.currentUserId(request);

      const channels = await this.chatCrud.retreiveChannelPanelsData(
        currentUserId,
      );

      const unreadMessagesPromises = channels.map(async (chElement) => {
        const unreadMessages =
          await this.chatCrud.getUnreadChannelMessagesNumber(
            currentUserId,
            chElement.id,
          ); //get the number of messages unread and unsent by this user
        const channelOwner = await this.chatCrud.findChannelOwner(chElement.id);
        const channelUsers = await this.chatCrud.findChannelUsers(chElement.id);
        const channelAdmins = await this.chatCrud.findChannelAdmins(
          chElement.id,
        );
        const channelBans = await this.chatCrud.retieveBlockedChannelUsers(
          chElement.id,
        );
        const channelMutes = await this.chatCrud.retieveMutedChannelUsers(
          chElement.id,
        );

        return {
          ...chElement,
          unread_messages: unreadMessages,
          channelUsers: channelUsers,
          channelOwner: channelOwner,
          channelAdmins: channelAdmins,
          channelBans: channelBans,
          channelMutes: channelMutes,
        };
      });

      // I wait for all promises to resolve
      const discussions = await Promise.all(unreadMessagesPromises);

      return discussions;
    } catch (error) {
      // Handle and log errors appropriately, avoid exposing sensitive information
      throw new InternalServerErrorException(
        'An error occurred while fetching discussion channels.',
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/direct_messaging/userContactsBook')
  async findAllUsersInContact(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);

    const users = await this.chatCrud.retrieveUserContactBook(currentUserId);

    return users;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/channels/userContactsBook')
  async findAllUsersWithCommonChannels(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);
    const users = await this.chatCrud.findUsersInCommonChannels(currentUserId);
    return users;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/Channels/channelsInfoBook')
  async findAllChannelsInContact(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);
    const users = await this.chatCrud.retrieveUserChannelsBook(currentUserId);
    return users;
  }
  @UseGuards(JwtAuthGuard)
  @Get(':roomid/messages')
  async findRoomMessages(
    @Req() request: Request,
    @Param('roomid') roomid: string,
  ) {
    const currentUserId = this.currentUserId(request);

    return await this.chatCrud.retrieveRoomMessages(currentUserId, roomid);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/direct_messaging/bannedRooms')
  async findBannedRoomsDm(@Req() request: Request) 
  {
    const currentUserId = this.currentUserId(request);

    const bannedRooms = await this.chatCrud.findBannedDmRooms(currentUserId);
    const bannedRoomsData = bannedRooms.map((item) => {
      return { room_id: item.id, blocker_id: item.blocker_id };
    });
    return bannedRoomsData;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/Channels/bannedRooms')
  async findBannedRoomsChannels(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);

    const bannedRooms = await this.chatCrud.findBannedChannelsRooms(
      currentUserId,
    );
    const bannedRoomsData = bannedRooms.map((item) => {
      return { room_id: item.channel_id, blocker_id: '' };
    });
    return bannedRoomsData;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/Channels/MuteRooms')
  async findMutenedRoomsChannels(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);

    const mutedRooms = await this.chatCrud.findMutedChannelsRooms(
      currentUserId,
    );
    const mutedRoomsData = mutedRooms.map((item) => {
      return { room_id: item.channel_id };
    });
    return mutedRoomsData;
  }
  @UseGuards(JwtAuthGuard)
  @Get('/userData')
  async getUserData(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);

    return this.userCrud.findUserSessionDataByID(currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    if (!file) {
      return { message: 'No file uploaded' };
    }
    file.filename = uuidv4() + file.originalname;

    const filePath = path.join(__dirname, '..', '../uploads/', file.filename);

    // Save the file to the server
    fs.writeFileSync(filePath, file.buffer);

    return {
      message: 'File uploaded and saved on the server',
      imageSrc: file.filename,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/memberCondidatesOfChannelCreation')
  async getFriends(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);

    return await this.userCrud.findFriendsUsernameAvatar(currentUserId);
  }

   @UseGuards(JwtAuthGuard)
  @UseGuards(allowJoinGuard)
  @Post('/channelJoinRequest')
  async handleChannelJoinRequest(
    @Req() request: Request,
    @Res() response: Response,
    @Body()
    channelRequestMembership: {
      channel_id: string;
      password: string;
      type: 'PROTECTED' | 'PRIVATE' | 'PUBLIC';
    },
  ) {
    const currentUserId = this.currentUserId(request);

    const channelMembershipData: channelMembershipDto = {
      channel_id: channelRequestMembership.channel_id,
      user_id: currentUserId,
      role: 'USER',
    };

    await this.chatCrud.joinChannel(channelMembershipData);
    return response.status(200).send('Channel join request is valid!');
  }

  ///////////////////////////////////////////////////////////
  //-                                  -//
  ///////////////////////////////////////////////////////////
  @UseGuards(JwtAuthGuard)
  @Get('/channels_users_inits')
  async findUserAndChannelToJoin(@Req() request: Request) {
    const currentUserId = this.currentUserId(request);
    const channelsToJoin = await this.chatCrud.findAllChannelsAvailbleToJoin(
      currentUserId,
    );
    const dmsToJoin = await this.chatCrud.findAllDmsAvailbleToJoin(
      currentUserId,
    );
    return { channelsToJoin: channelsToJoin, dmsToJoin: dmsToJoin };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/DirectMessaging/CreateDm/:username')
  async createDmRoom(
    @Req() request: Request,
    @Res() response: Response,
    @Param('username') username: string,
  ) {
    const currentUserId = this.currentUserId(request);
    const userToContact = await this.userCrud.findUserByUsername(username);
    if (await this.chatCrud.findDmByUsers(currentUserId, userToContact)) {
      return response.status(400).send('dm already exists');
    }
    const dmData: dmDto = {
      user1_id: currentUserId,
      user2_id: userToContact,
      status: 'ALLOWED',
    };
    const dm = await this.chatCrud.createDm(dmData);
    return response
      .status(200)
      .send({ dm_id: dm, userToContact: userToContact });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/DirectMessaging/getPartner/:dm_id')
  async getPartner(@Req() request: Request, @Param('dm_id') dm_id: string) {
    const currentUserId = this.currentUserId(request);

    const partner = await this.chatCrud.findDmPartnerId(dm_id, currentUserId);
    return partner;
  }
}

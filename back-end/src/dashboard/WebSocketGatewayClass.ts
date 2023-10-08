import {Server, Socket} from 'socket.io';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Injectable, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-aut.guard';
import { UserCrudService } from 'src/prisma/user-crud.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { stringify } from 'querystring';
import { checkPrime } from 'crypto';

@WebSocketGateway({cors: true, origins: 'http://localhost:3000'})
@Injectable()
// @UseGuards(JwtAuthGuard)
export class WebSocketGatewayClass implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    constructor(private readonly user : UserCrudService, private readonly authservice: AuthService, private readonly service: PrismaService){};
    private clients: Map<string, Socket> = new Map();

    async handleConnection(client: Socket) {
        const token : any = client.handshake.query.token;
        if (token)
        {
          const tokenParts = token.split(' ');
          const JwtToken: string = tokenParts[1];
          const payload: any = this.authservice.extractPayload(JwtToken);
        if (payload)
        {
          const clientRoom = `room_${payload.userId}`;
          console.log('clientRoom : ', clientRoom);
          client.join(clientRoom);
        }
        this.clients.set(client.id, client);
        }
    }
    

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
    }

    
    @SubscribeMessage('sendNotification')
    // @UseGuards(JwtAuthGuard)
    async handleSendNotification(@MessageBody() notificationData: any){
        const targetClientRoom = `room_${notificationData.user_id}`;
        const token: any = notificationData.token;
        const tokenParts = token.split(' ');
        const JwtToken: string = tokenParts[1];
    
        const payload: any = this.authservice.extractPayload(JwtToken);
        try {
            await this.user.createNotification(notificationData.user_id, payload.userId, notificationData.type);
            const getnotificationtable = await this.user.findUserByID(payload.userId);
            this.server.to(targetClientRoom).emit('notification', getnotificationtable);
        } catch (error) {
          console.error('Error creating notification:', error);
        }
      };

      @SubscribeMessage('responserequest')
      async handleresponserequest(@MessageBody() notificationData: any)
      {
        const token: any = notificationData.token;
        const tokenParts = token.split(' ');
        const JwtToken: string = tokenParts[1];
    
        const payload: any = this.authservice.extractPayload(JwtToken);
        if (notificationData.response === 'accept')
        {
          // console.log('user_id', payload.userId);
          try
          {
            // console.log('My Id : ' + payload.userId + ' notificationData : ' + notificationData.user_id);
            const check = await this.service.prismaClient.friendships.findMany({
              where: {
                  OR: [
                      {user1_id: payload.userId, user2_id: notificationData.user_id},
                      {user1_id: notificationData.user_id, user2_id: payload.userId},
                  ],
              },
              select : {
                id: true,
              }
            });
            if (check.length === 0)
            {
              await this.user.createFriendShip(payload.userId, notificationData.user_id);
              const usersId: any[] = await this.user.findFriendsList(payload.userId);
              const users: any[] = [];
              await Promise.all(
              usersId.map(async (user) => {
                const userData = await this.user.findUserByID(user);
                users.push(userData);
              })
              );
              const MyClientRoom = `room_${payload.userId}`;
              this.server.to(MyClientRoom).emit('friend', users);

              // send to other user
              const usersId_other: any[] = await this.user.findFriendsList(notificationData.user_id);
              const users_other: any[] = [];
    
              await Promise.all(
                usersId_other.map(async (user) => {
                const userData = await this.user.findUserByID(user);
                users_other.push(userData);
              })
              );
              const targetClientRoom = `room_${notificationData.user_id}`;
              this.server.to(targetClientRoom).emit('friend', users_other);
            }
          }
          catch (error)
          {
              console.log('Error :', error);
          }
        }
      }
      @SubscribeMessage('status')
      async handleonline(@MessageBody() notificationData: any)
      {
        const token: any = notificationData.token;
        if (token)
        {
          const tokenParts = token.split(' ');
          const JwtToken: string = tokenParts[1];
          const payload: any = this.authservice.extractPayload(JwtToken);
          const usersId: any [] = await this.user.findFriendsList(payload.userId);
          // console.log('users : ', users);
          if (usersId)
          {
            usersId.map(async (userId) => {
              const targetClientRoom = `room_${userId}`;
          //     // console.log('target : ', targetClientRoom);
              if (notificationData.status === 'online')
              {
                await this.user.changeVisibily(payload.userId, "ONLINE");
          //       // const user = await this.user.findUserByID(userId);
          //       // console.log('users : ', user);
                const usersId: any[] = await this.user.findFriendsList(userId);
                // console.log("users ID : ", usersId);
                const users: any[] = [];

                await Promise.all(
                  usersId.map(async (user) => {
                      const userData = await this.user.findUserByID(user);
                      users.push(userData);

                  })
                );
                this.server.to(targetClientRoom).emit('online', users);
              }
              else if (notificationData.status === 'offline')
              {
                await this.user.changeVisibily(payload.userId, "OFFLINE");
          //       this.server.to(targetClientRoom).emit('offline', payload.userId);
          const usersId: any[] = await this.user.findFriendsList(userId);
                // console.log("users ID : ", usersId);
                const users: any[] = [];

                await Promise.all(
                  usersId.map(async (user) => {
                      const userData = await this.user.findUserByID(user);
                      users.push(userData);

                  })
                );
                this.server.to(targetClientRoom).emit('offline', users);
              }
            })
          }
        }
      }
}
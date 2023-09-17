import {Server, Socket} from 'socket.io';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { UserCrudService } from 'src/prisma/user-crud.service';

@WebSocketGateway({cors: true, origins: 'http://localhost:3000'})
@Injectable()
export class WebSocketGatewayClass implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;
    constructor(private readonly user: UserCrudService){};
    private clients: Map<string, Socket> = new Map();

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        let alldata;
        const clientRoom = `room_${client.id}`;
        client.join(clientRoom);
        const notification = [
            { user_id : 'user1', type: 'follow'},
            { user_id : 'user2', type: 'game'},
            { user_id : 'user3', type: 'follow'},
            { user_id : 'user44', type: 'follow'}
        ];
        client.emit('sendlist', notification);
        client.on('sendNotification', (notificationData: any) => {
            // const user = this.user.findUserByID('asf124naofssdafi4123');
            // add it in bdd
            this.server.emit('notification', notificationData);
            // this.server.to(clientRoom).emit('notification', notificationData);
        });
        client.on('reponserequest', (response: string) => {
            if (response === 'accept')
            {
                // this.user.createFriendShip()
                // add friend
                console.log('accept');
            }
        })
        this.clients.set(client.id, client);
    }
    

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.clients.delete(client.id);
    }

    @SubscribeMessage('connection')
    async handleMessage(client: Socket, requestData: {targetUserId: string, senderId: string})
    {
        try
        {
            
            // console.log(this.clients.size);
            // const {targetUserId, senderId} = requestData;
            // console.log(targetUserId + '_' + senderId);
            // if (this.clients.size > 0) {
            //   const firstClient = this.clients.values().next().value;
            //   firstClient.emit('followeNotification', {message: 'You have a new follower!', id: senderId});
            // firstClient.emit('followeNotification', {message: 'You have a new follower!', id: senderId});
              // Now 'firstClient' contains the first Socket in the map.
            
            
        }
            // else
            // {
            //     client.emit('message', 'User is not online');
            // }
            // console.log(data);
            // const userExists = await this.user.findUserByID(data);
            // if (userExists)
            // {
            //     const userSocket = this.clients.get(userExists.id);
            //     if (userSocket)
            //         userSocket.emit('sendnotification', 'follownotification');
            //     else{
                    // client.emit('sendnotification', 'follownotification');
                // }
        //    }
        //     else
        //     {
        //         client.emit('message', 'User not found');
        //     }
        catch(error)
        {
            console.error('Error handling message:', error.message);
        }
    }
    

}
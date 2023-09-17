import { Body, Controller, Get, Patch } from '@nestjs/common';
import { WebSocketGatewayClass } from 'src/Dashboard/dashboard/WebSocketGatewayClass';
import { AppService } from 'src/app.service';
import { matchDto } from 'src/chat/dto/match.dto';
import { testDto } from 'src/chat/dto/test.dto';
import { GameCrudService } from 'src/prisma/prisma/game-crud.service';
import { UserCrudService } from 'src/prisma/prisma/user-crud.service';

@Controller('api')
export class DashboardController {
    constructor(private readonly appService: AppService,private readonly user : UserCrudService, private readonly resultgame : GameCrudService, private readonly websocketDashboard: WebSocketGatewayClass) {}
    @Get('Dashboard')
  display(): testDto
  {
      const user1 : testDto = {
        id: 1,
        username: 'oussama',
        status: 'ONLINE'
      }
      return user1;
  }

  @Get('Dashboard/allfriends')
  sendAllfriend()
  {
    const findFriend = [
      {id: 1, userFriend: 'user1234', status: 'OFFLINE'},
      {id: 2, userFriend: 'soufian44', status: 'IN_GAME'},
      {id: 3, userFriend: 'abdellah', status: 'OFFLINE'},
      {id: 4, userFriend: 'zakaria', status: 'ONLINE'},
      {id: 5, userFriend: 'user1234', status: 'OFFLINE'},
      {id: 6, userFriend: 'soufian55', status: 'IN_GAME'},
      {id: 7, userFriend: 'user1234', status: 'ONLINE'},
      {id: 8, userFriend: 'user1234', status: 'ONLINE'},
      {id: 9, userFriend: 'user1234', status: 'ONLINE'},
    ]
      // return this.user.findFriendsList()
      return findFriend;
  }

  @Get('Dashboard/friends')
  sendUser()
  {
    const friendtable = [
      {id: 1, username: 'hassan', status: 'OFFLINE'},
      {id: 2, username: 'luis', status: 'IN_GAME'},
      {id: 3, username: 'dakhch', status: 'ONLINE'},
      {id: 4, username: 'luis', status: 'IN_GAME'},
      {id: 5, username: 'dakhch', status: 'ONLINE'},
      {id: 6, username: 'dakhch', status: 'ONLINE'},
      {id: 7, username: 'dakhch', status: 'ONLINE'}
    ]
      // return this.user.findFriendsList('1');
      return friendtable;
  }

  @Get('Dashboard/friends/result')
  result()
  {
    const friendresult : matchDto[] = [
      {player_1_id: 'luis', player_2_id: 'user234', result: '8-4'},
      {player_1_id: 'luis', player_2_id: 'user443', result: '7-9'},
      {player_1_id: 'luis', player_2_id: 'mon3ich', result: '3-4'},
      {player_1_id: 'luis', player_2_id: 'user443', result: '2-1'},
    ]
    return friendresult;
      // return this.resultgame.retieveAllGamerecords()
  }

  @Get('Dashboard/game')
  game()
  {
    // return stats table
    const game = {
      win: 10, losses: 5, ladder_level: 1
    }
    return game;
  }

  // @Post('Dashboard/addfriend')
  // addfriends(@Body() data: any)
  // {
  //     console.log('Receive data', data);
  //     return data;
  // }

  @Get('Dashboard/statistic')
  sendStatistic()
  {
    const statistic =  [
      {result: '8-4', date: '2023-08-11'},
      {result: '8-0', date: '2023-08-11'},
      {result: '8-4', date: '2023-08-11'},
      {result: '8-0', date: '2023-08-12'},
      {result: '8-4', date: '2023-08-12'},
      {result: '8-0', date: '2023-08-12'},
      {result: '8-4', date: '2023-08-12'},
      {result: '8-0', date: '2023-08-12'},
      {result: '7-9', date: '2023-08-13'},
      {result: '5-7', date: '2023-08-13'},
      {result: '2-3', date: '2023-08-14'},
      {result: '2-3', date: '2023-08-14'},
      {result: '2-3', date: '2023-08-14'},
      {result: '2-3', date: '2023-08-14'},
      {result: '2-3', date: '2023-08-14'},
      {result: '8-4', date: '2023-08-17'},
      {result: '8-0', date: '2023-08-15'},
      {result: '8-4', date: '2023-08-19'},
      {result: '8-0', date: '2023-08-12'},
      {result: '8-4', date: '2023-08-21'},
      {result: '8-0', date: '2023-08-13'},
      {result: '8-4', date: '2023-08-10'},
      {result: '8-0', date: '2023-08-10'},
      {result: '7-9', date: '2023-08-13'},
      {result: '5-7', date: '2023-08-12'},
      {result: '2-3', date: '2023-08-14'},
      {result: '2-3', date: '2023-08-546'},
      {result: '2-3', date: '2023-08-134'},
      {result: '2-3', date: '2023-08-14'},
    ]
    
    return statistic;
  }

  @Patch('Dashboard/setting')
  setting(@Body() data: any)
  {
    console.log(`setting : ${data.twofactor}`);
  }

  // @Patch('Dashboard/Section')
  // Section(@Body() data: any)
  // {
  //   console.log(data);
  // }
}

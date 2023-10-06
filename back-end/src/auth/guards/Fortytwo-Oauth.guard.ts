import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";



@Injectable()
export default class FortytwoOauthGuard extends AuthGuard('42'){
}
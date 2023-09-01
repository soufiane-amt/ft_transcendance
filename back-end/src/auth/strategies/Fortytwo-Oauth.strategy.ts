import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy , VerifyCallback } from "passport-42";

@Injectable()
export class Fortytwostrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
        clientID: process.env.UID,
        clientSecret: process.env.SECRET,
        callbackURL: process.env.REDIRECT_URI,
        scope: ['public'],
      });
  } ;
  
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,

  ) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        done(null, profile)
  };
};
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-42';

@Injectable()
export class Fortytwostrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.UID,
      clientSecret: process.env.SECRET,
      callbackURL: process.env.REDIRECT_URI,
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    data: any,
    done: VerifyCallback,
  ) {
    const user = {
      login: data._json.login,
      firstname: data._json.first_name,
      last_name: data._json.last_name,
      full_name: data._json.displayname,
      email: data._json.email,
      avatar: data._json.image.link,
    };

    return user;
  }
}

import { IsString } from 'class-validator'

export default class MatchMakingDto {
    @IsString()
    role: string;
    @IsString()
    mapType: string;
    @IsString()
    speed: string;
}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfileEntity } from "../entities/userProfile.entity";
import { ProfilesController } from "./profile.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserProfileEntity])],
    controllers: [ProfilesController],
    providers: [],
})

export class ProfilesModule { }

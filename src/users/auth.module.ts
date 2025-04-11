import { Module } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataToResponse } from 'utility/responceData/dataToReturn';
import { UserProfileEntity } from './entities/userProfile.entity';
import { MailModule } from './mail/mail.module';
import { AuthService } from './auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserProfileEntity]), MailModule],
    controllers: [AuthController],
    providers: [AuthService, DataToResponse],
    exports: [AuthService]
})

export class AuthModule { }

import { Module } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataToResponse } from 'utility/responceData/dataToReturn';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, DataToResponse ],
    exports: [UserService]
})
export class UserModule { }

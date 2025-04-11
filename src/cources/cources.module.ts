import { Module } from '@nestjs/common';
import { CourcesController } from './cources.controller';
import { CourcesService } from './cources.service';
import { CourceEntity } from './entities/cource.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourceEntity]), TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [CourcesController],
  providers: [CourcesService],
  exports: [CourcesService],
})
export class CourcesModule { }

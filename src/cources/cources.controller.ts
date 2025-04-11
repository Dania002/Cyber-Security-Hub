import { Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { CourcesService } from './cources.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CourceEntity } from './entities/cource.entity';
import { Repository } from 'typeorm';
import { AddNewCourceDTO } from './dto/add-new-cource.dto';
import { AuthenticationGuard } from 'utility/guards/authentication.guard';
import { AuthorizeGuard } from 'utility/guards/authorization.guard';
import { Roles } from 'utility/common/user.roles.enum';
import { CurrentUser } from 'utility/decorators/curren-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('cources')
export class CourcesController {
    constructor(
        private readonly courcesService: CourcesService,
        @InjectRepository(CourceEntity) private courceRepository: Repository<CourceEntity>,
    ) { }

    @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.SPECIALIST]))
    @Post('add-new-cource')
    async addNewCource(@Body() addNewCourceDTO: AddNewCourceDTO, @CurrentUser() currentUser: UserEntity) {
        return await this.courcesService.createCource(addNewCourceDTO, currentUser);
    }

    @Get(':id')
    async getCourceById(@Param('id') id: number) {
        const cource = await this.courceRepository.findOne({
            where: { id },
            relations: ['specialest'],
        });

        if (!cource) {
            throw new NotFoundException('Cource not found');
        }

        return cource;
    }   
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourceEntity } from './entities/cource.entity';
import { DeepPartial, Repository } from 'typeorm';
import { AddNewCourceDTO } from './dto/add-new-cource.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CourcesService {
    constructor(
        @InjectRepository(CourceEntity)
        private courceRepository: Repository<CourceEntity>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }
    async createCource(addNewCourceDTO: AddNewCourceDTO, currentUser: UserEntity) {
        const userWithProfile = await this.userRepository.findOne({
            where: { id: currentUser.id },
            relations: ['profile'],
        });

        if (!userWithProfile || !userWithProfile.profile) {
            throw new BadRequestException('User does not have a profile.');
        }

        const cource = this.courceRepository.create({
            img: addNewCourceDTO.img,
            title: addNewCourceDTO.title,
            description: addNewCourceDTO.description,
            specialest: userWithProfile.profile,
        } as DeepPartial<CourceEntity>);
        return await this.courceRepository.save(cource);
    }

    async findCourse(id: number) {
        const course = await this.courceRepository.findOne(
            {
                where: { id: id },
                relations: { user: true }
            }

        );
        if (!course) throw new NotFoundException('Course not found');
        return course;
    }

    async findCource(id: number) {
        const course = await this.courceRepository.findOne(
            {
                where: { id },
                relations: ['specialest'],
            }
        );

        if (!course) throw new NotFoundException('Course not found');
        return course;
    }
}



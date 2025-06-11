import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileEntity } from '../entities/userProfile.entity';

@Controller('profiles')
export class ProfilesController {
    constructor(
        @InjectRepository(UserProfileEntity)
        private readonly profileRepository: Repository<UserProfileEntity>,
    ) { }

    @Get(':id')
    async getProfileById(@Param('id') id: number) {
        const profile = await this.profileRepository.findOne({
            where: { id },
            relations: ['user', 'cources'],
        });

        if (!profile) {
            throw new NotFoundException(`Profile with ID ${id} not found.`);
        }

        return profile;
    }

    @Get()
    async getAllProfiles() {
        const profile = await this.profileRepository.find({
            relations: ['user', 'cources'],
        });

        return profile;
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileEntity } from '../entities/userProfile.entity';

@Injectable()
export class ProfilesService {
    constructor(
        @InjectRepository(UserProfileEntity)
        private readonly userProfileRepository: Repository<UserProfileEntity>,
    ) {}

    async getProfileWithCourses(id: number) {
        const profile = await this.userProfileRepository.findOne({
            where: { id },
            relations: ['cources'],
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        return profile;
    }
}

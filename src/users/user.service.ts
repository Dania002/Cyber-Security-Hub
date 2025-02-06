import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { hash } from "bcryptjs";
import { DataToResponse } from "utility/responceData/dataToReturn";
import { UserLogInDto } from "./dto/user-login.dto";
import * as bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private readonly dataToResponse: DataToResponse,
    ) { }

    async signup(userSignUpDto: UserSignUpDto) {
        const userExists = await this.findUserByEmail(userSignUpDto.email);
        if (userExists) throw new ConflictException('Email already exists.')

        userSignUpDto.password = await hash(userSignUpDto.password, 10);

        let user = this.userRepository.create(userSignUpDto);
        user = await this.userRepository.save(user);

        return this.dataToResponse.userData(user);
    }

    async login(userSignInDto: UserLogInDto): Promise<UserEntity> {
        const userExists = await this.findUserByEmail(userSignInDto.email);
        if (!userExists) throw new NotFoundException('Email is not available.');

        const isPasswordValid = await bcrypt.compare(userSignInDto.password, userExists.password);
        if (!isPasswordValid) throw new BadRequestException('Incorrect password.');

        return userExists;
    }

    async findUserByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
    }

    async findCurrent(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async accessToken(user: UserEntity): Promise<string> {
        return sign(
            { id: user.id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET_KEY || "$3cReT",
            { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE_TIME || "30") }
        );
    }
}

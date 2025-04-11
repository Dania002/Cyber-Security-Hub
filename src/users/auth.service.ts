import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { hash } from "bcryptjs";
import { UserLogInDto } from "./dto/user-login.dto";
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from './mail/mail.service';
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UserProfileEntity } from "./entities/userProfile.entity";
import { sign } from 'jsonwebtoken';
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { EditUserDto } from "./dto/edit-user.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(UserProfileEntity)
        private userProfileRepository: Repository<UserProfileEntity>,
        private readonly mailService: MailService,
    ) { }

    async signup(userSignUpDto: UserSignUpDto) {
        const emailExists = await this.findUserByEmail(userSignUpDto.email);
        if (emailExists) throw new ConflictException('Email already exists.');

        const phoneNumberExists = await this.findUserByPhoneNumber(userSignUpDto.phoneNumber);
        if (phoneNumberExists) throw new ConflictException('Phone Number already used.');

        if ((userSignUpDto.password !== userSignUpDto.confirmPassword)) throw new BadRequestException('Passwords do not match.');

        userSignUpDto.password = await hash(userSignUpDto.password, 10);

        const verificationToken = uuidv4();

        let user = this.userRepository.create({
            ...userSignUpDto,
            isVerified: false,
            verificationToken
        });

        user = await this.userRepository.save(user);

        await this.mailService.sendVerificationEmail(user);

        return "Check your email to verify your account."
    }

    async createProfile(createProfileDto: CreateProfileDto, currentUser: UserEntity) {

        const existingProfile = await this.userProfileRepository.findOne({
            where: { user: { id: currentUser.id } },
        });

        if (existingProfile) {
            throw new BadRequestException('User already has a profile.');
        }

        const profile = this.userProfileRepository.create(createProfileDto);

        profile.user = currentUser;

        await this.userProfileRepository.save(profile);

        return await this.userProfileRepository.findOne({
            where: { user: { id: currentUser.id } },
            relations: ["cources"],
        });

    }

    async login(userSignInDto: UserLogInDto): Promise<UserEntity> {
        const userExists = await this.findUserByEmail(userSignInDto.email);
        if (!userExists) throw new NotFoundException('Email is not available.');

        const isPasswordValid = await bcrypt.compare(userSignInDto.password, userExists.password);
        if (!isPasswordValid) throw new BadRequestException('Incorrect password.');

        if (userExists.isVerified == false) throw new BadRequestException("Please Verify Your Email.")

        return userExists;
    }

    async findUserByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
    }

    async findUserByPhoneNumber(phoneNumber: string) {
        return await this.userRepository.findOneBy({ phoneNumber });
    }

    async findCurrent(id: number): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ["roles"],
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findUserByToken(token: string) {
        return await this.userRepository.findOne({ where: { verificationToken: token } });
    }

    async accessToken(user: UserEntity) {
        return sign(
            { id: user.id, email: user.email },
            Buffer.from(process.env.ACCESS_TOKEN_SECRET_KEY || "default-secret"),
            { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRE_TIME_IN_MINUTS) * 60 }
        );
    }

    async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
        const user = await this.findUserByEmail(forgetPasswordDto.email);
        if (!user) throw new NotFoundException("Email doesn't exist.");

        user.verificationToken = uuidv4();
        await this.userRepository.save(user);

        await this.mailService.sendResetPasswordEmail(user);

        return { message: "Check your email for the reset password link." };
    }

    async resetPassword(token: string, newPassword: string) {
        if (!token || !newPassword) {
            throw new BadRequestException("Token and new password are required.");
        }

        const user = await this.findUserByToken(token);
        if (!user) throw new BadRequestException("Invalid or expired token.");

        user.password = await hash(newPassword, 10);
        user.verificationToken = '';
        await this.userRepository.save(user);

        return { message: "Password reset successfully." };
    }

    async editUserProfile(editUserDto: EditUserDto) {
        const user = this.userRepository.create({
            ...editUserDto
        });

        return  await this.userRepository.save(user);
    }

    // async editUserProfile(editUserDto: EditUserDto, currentUser: UserEntity) {
    //     const user = await this.userRepository.findOne({ where: { id: currentUser.id } });
    //     if (!user) throw new NotFoundException('User not found.');
    
    //     Object.assign(user, editUserDto);
    
    //     return await this.userRepository.save(user);
    // }
    
}
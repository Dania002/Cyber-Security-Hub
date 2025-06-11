import { BadRequestException, Body, Controller, Get, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { UserLogInDto } from "./dto/user-login.dto";
import { DataToResponse } from "utility/responceData/dataToReturn";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { AuthorizeGuard } from "utility/guards/authorization.guard";
import { Roles } from "utility/common/user.roles.enum";
import { AuthenticationGuard } from "utility/guards/authentication.guard";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { CurrentUser } from "utility/decorators/curren-user.decorator";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import { EditUserDto } from "./dto/edit-user.dto";
import { EditProfileDto } from "./dto/edit-profile.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UseInterceptors, UploadedFile } from '@nestjs/common';

const editFileName = (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtName = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
    callback(null, filename);
};


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly dataToResponse: DataToResponse,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) { }

    @Post('signup')
    async signup(@Body() userSignUpDto: UserSignUpDto) {
        return await this.authService.signup(userSignUpDto);
    }

    @Get('verify-email')
    async verifyEmail(@Query('token') token: string) {
        if (!token) throw new BadRequestException('Token is required.');

        const user = await this.authService.findUserByToken(token);

        if (!user) throw new BadRequestException('Invalid or expired token.');

        user.isVerified = true;

        await this.userRepository.save(user);
        {
            "message"; "Check your email to verify your account."
        }

    }

    @Post('login')
    async signin(@Body() userSignInDto: UserLogInDto) {
        const user = await this.authService.login(userSignInDto);
        const accessToken = await this.authService.accessToken(user);
        return { accessToken, user: this.dataToResponse.userData(user) };
    }

    @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.SPECIALIST]))
    @Post('createprofile')
    @UseInterceptors(
        FileInterceptor('cv', {
            storage: diskStorage({
                destination: './uploads/cvs',
                filename: editFileName,
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
                    return callback(new BadRequestException('Only PDF, DOC, or DOCX files are allowed.'), false);
                }
                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    async createProfile(
        @UploadedFile() file: any,
        @Body() createProfileDto: CreateProfileDto,
        @CurrentUser() currentUser: UserEntity,
    ) {
        if (!file) {
            throw new BadRequestException('CV file is required.');
        }

        createProfileDto.cv = file.filename;
        return await this.authService.createProfile(createProfileDto, currentUser);
    }

    @UseGuards(AuthenticationGuard)
    @Patch('edit-account')
    async editAccount(
        @Body() editUserDto: EditUserDto,
        @CurrentUser() currentUser: UserEntity,
    ) {
        return await this.authService.editAccount(editUserDto, currentUser);
    }

    @UseGuards(AuthenticationGuard)
    @Patch('edit-profile')
    async editProfile(
        @Body() editProfileDto: EditProfileDto,
        @CurrentUser() currentUser: UserEntity,
    ) {
        return await this.authService.editProfile(editProfileDto, currentUser);
    }

    @Post('forgetpassword')
    async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
        return await this.authService.forgetPassword(forgetPasswordDto);
    }

    @Post('reset-password')
    async resetPassword(@Body() body: { token?: string, newPassword?: string, confirmPassword?: string }) {

        if (!body || !body.token || !body.newPassword || !body.confirmPassword) {
            throw new BadRequestException("All fields (token, newPassword, confirmPassword) are required.");
        }

        if (body.newPassword !== body.confirmPassword) {
            throw new BadRequestException("Passwords do not match.");
        }

        return await this.authService.resetPassword(body.token, body.newPassword);
    }

    @UseGuards(AuthenticationGuard)
    @Get('myprofile')
    async getMyProfile(@CurrentUser() user: UserEntity) {
        return await this.authService.getUserProfile(user);
    }

    @UseGuards(AuthenticationGuard)
    @Get('myaccount')
    async getMyAccount(@CurrentUser() user: UserEntity) {
        return await this.authService.getUserAccount(user);
    }
}
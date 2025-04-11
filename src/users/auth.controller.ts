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

        return { message: 'Email successfully verified!' };
    }

    @Post('login')
    async signin(@Body() userSignInDto: UserLogInDto) {
        const user = await this.authService.login(userSignInDto);
        const accessToken = await this.authService.accessToken(user);
        return { accessToken, user: this.dataToResponse.userData(user) };
    }

    @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.SPECIALIST]))
    @Post('createprofile')
    async crateProfile(@Body() createProfileDto: CreateProfileDto, @CurrentUser() currentUser: UserEntity) {
        return await this.authService.createProfile(createProfileDto, currentUser);
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
    @Patch('edit-profile')
    async editProfile(@Body() editUserDto: EditUserDto, @CurrentUser() currentUser: UserEntity) {
        return await this.authService.editUserProfile(editUserDto);
    }
}
import { Body, Controller, Post } from "@nestjs/common";
import { UserSignUpDto } from "./dto/user-signup.dto";
import { UserService } from "./user.service";
import { UserLogInDto } from "./dto/user-login.dto";
import { DataToResponse } from "utility/responceData/dataToReturn";

@Controller('users')
export class UserController {
    constructor(
        private readonly usersService: UserService,
        private readonly dataToResponse: DataToResponse,

    ) { }

    @Post('signup')
    async signup(@Body() userSignUpDto: UserSignUpDto) {
        return await this.usersService.signup(userSignUpDto);
    }

    @Post('login')
    async signin(@Body() userSignInDto: UserLogInDto) {
        const user = await this.usersService.login(userSignInDto);
        const accessToken = await this.usersService.accessToken(user);
        return { accessToken, user: this.dataToResponse.userData(user) };
    }
}
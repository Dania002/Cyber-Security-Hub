import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserLogInDto } from "./user-login.dto";
import { Roles } from "utility/common/user.roles.enum";

export class UserSignUpDto extends UserLogInDto {
    @IsNotEmpty({ message: 'First Name can not be empty.' })
    @IsString({ message: 'First Name should be string.' })
    firstName: string;

    @IsNotEmpty({ message: 'Last Name can not be empty.' })
    @IsString({ message: 'Last Name should be string.' })
    lastName: string;

    @IsNotEmpty({ message: 'Role cannot be empty.' })
    @IsEnum(Roles, {message: 'Role must be one of: specialist, user'})
    role: Roles;
}

import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, Matches, MinLength, Validate } from "class-validator";
import { Roles } from "utility/common/user.roles.enum";
import { Match } from "utility/decorators/match.decorator";
import { Countries } from "utility/common/country.enum";

export class UserSignUpDto {
    @IsNotEmpty({ message: 'First Name cannot be empty.' })
    @IsString({ message: 'First Name should be string.' })
    firstName: string;

    @IsNotEmpty({ message: 'Last Name cannot be empty.' })
    @IsString({ message: 'Last Name should be string.' })
    lastName: string;

    @IsNotEmpty({ message: 'Email can not be empty.' })
    @IsEmail({}, { message: 'Please enter a valid email.' })
    email: string;

    @IsNotEmpty({ message: 'Country cannot be empty.' })
    @IsEnum(Countries, { message: 'Country must be one of: Palestine, Jordan, KSA, UAE, Qatar, Bahrain, Kuwait, Oman, Yemen, Iraq, Iran, Syria, Lebanon, Turkey, Egypt' })
    country: Countries;

    @IsNotEmpty({ message: 'Phone number cannot be empty.' })
    @IsString({ message: 'Phone number must be a string.' })
    @Matches(/^00\d{8,15}$/, { message: 'Phone number must start with "00" followed by country code and number (e.g., 001234567890).' })
    phoneNumber: string;

    @IsNotEmpty({ message: 'Role cannot be empty.' })
    @IsEnum(Roles, { message: 'Role must be one of: specialist, user' })
    role: Roles;

    @IsStrongPassword({}, { message: 'Please enter a strong password' })
    @IsNotEmpty({ message: 'Password can not be empty.' })
    @MinLength(5, { message: 'Password minimum character should be 5' })
    password: string;

    @IsNotEmpty({ message: 'Confirm Password cannot be empty.' })
    @Validate(Match, ['password'], { message: 'Passwords do not match' })
    confirmPassword: string;
}

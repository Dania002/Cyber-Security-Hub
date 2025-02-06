import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class UserLogInDto {
    @IsNotEmpty({message: 'Email can not be empty.'})
    @IsEmail({}, { message: 'Please enter a avalid email.' })
    email: string;

    @IsStrongPassword({}, {message: 'Please enter a strong password'})
    @IsNotEmpty({ message: 'Password can not be empty.' })
    @MinLength(5, { message: 'Password minimum character should be 5' })
    password: string;
}

import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordDto {
    @IsNotEmpty({message: 'Email can not be empty.'})
    @IsEmail({}, { message: 'Please enter a valid email.' })
    email: string;
}

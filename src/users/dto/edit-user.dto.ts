import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class EditUserDto {
    @IsOptional()
    @IsString({ message: 'First Name should be string.' })
    firstName: string;

    @IsOptional()
    @IsString({ message: 'Last Name should be string.' })
    lastName: string;

    @IsOptional()
    @IsEmail({}, { message: 'Please enter a valid email.' })
    email: string;

    @IsOptional()
    @IsString({ message: 'Phone number must be a string.' })
    @Matches(/^00\d{8,15}$/, { message: 'Phone number must start with "00" followed by country code and number (e.g., 001234567890).' })
    phoneNumber: string;
}

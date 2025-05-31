import { IsOptional, IsString, IsEmail, Matches, IsEnum } from 'class-validator';
import { Countries } from 'utility/common/country.enum';

export class EditUserDto {
    @IsOptional()
    @IsString({ message: 'First Name should be string.' })
    firstName?: string;

    @IsOptional()
    @IsString({ message: 'Last Name should be string.' })
    lastName?: string;

    @IsOptional()
    @IsEnum(Countries, { message: 'Country must be one of: Palestine, Jordan, KSA, UAE, Qatar, Bahrain, Kuwait, Oman, Yemen, Iraq, Iran, Syria, Lebanon, Turkey, Egypt' })
    country?: Countries;

    @IsOptional()
    @IsEmail({}, { message: 'Please enter a valid email.' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'Phone number must be a string.' })
    @Matches(/^00\d{8,15}$/, { message: 'Phone number must start with "00" followed by country code and number.' })
    phoneNumber?: string;
}

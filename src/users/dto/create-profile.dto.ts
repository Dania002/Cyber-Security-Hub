import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Levels } from "utility/common/level.enum";

export class CreateProfileDto {
    @IsNotEmpty({ message: 'Birth Date cannot be empty.' })
    birthDate: Date;

    @IsNotEmpty({ message: 'Level cannot be empty.' })
    @IsEnum(Levels, { message: "Level must be one of: Bachelor's Degree, Master's Degree, Doctoral Degree, Postdoctoral Studies, Professional Certifications" })
    level: Levels;

    @IsNotEmpty({ message: 'CV can not be empty.' })
    cv: string;

    @IsOptional({ message: 'Certification is optional.' })
    @IsString({ message: 'Certification should be string.' })
    certification: string;

    @IsNotEmpty({ message: 'About Me cannot be empty.' })
    @IsString({ message: 'About Me should be string.' })
    aboutMe: string;
}
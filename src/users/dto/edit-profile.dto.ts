import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { Levels } from 'utility/common/level.enum';

export class EditProfileDto {
    @IsOptional()
    @IsDateString({}, { message: 'Birth Date must be a valid date.' })
    birthDate?: Date;

    @IsOptional()
    @IsEnum(Levels, { message: "Level must be one of: Bachelor's Degree, Master's Degree, Doctoral Degree, Postdoctoral Studies, Professional Certifications", })
    level?: Levels;

    @IsOptional()
    cv?: string;

    @IsOptional()
    @IsString({ message: 'Certification should be string.' })
    certification?: string;

    @IsOptional()
    @IsString({ message: 'About Me should be string.' })
    aboutMe?: string;
}

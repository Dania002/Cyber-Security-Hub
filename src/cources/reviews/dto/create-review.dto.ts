import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
    @IsNotEmpty({ message: 'Course Id should not be empty' })
    @IsNumber({}, { message: 'Course Id should be number' })
    courseId: number;

    @IsNotEmpty({ message: 'Name cannot be empty.' })
    @IsString({ message: 'Name should be string.' })
    name: string;

    @IsNotEmpty({ message: 'Comment should not be empty' })
    @IsString({ message: 'Comment should be string' })
    comment: string;

    @IsNotEmpty({ message: 'Rating should not be empty' })
    @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Rating should be a number with max precision of 1.' })
    @Min(0, { message: 'Rating must be at least 0.' })
    @Max(5, { message: 'Rating must be at most 5.' })
    rating: number;
}

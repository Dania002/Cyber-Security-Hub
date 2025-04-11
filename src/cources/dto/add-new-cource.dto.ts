import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AddNewCourceDTO {

    @IsNotEmpty({ message: 'Title can not be empty.' })
    @IsString({ message: 'Title should be string.' })
    title: String;

    @IsNotEmpty({ message: 'Description can not be empty.' })
    @IsString({ message: 'Description should be string.' })
    description: String;

    @IsOptional()
    @IsString()
    img: string;
}
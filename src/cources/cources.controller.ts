import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CourcesService } from './cources.service';
import { InjectRepository } from '@nestjs/typeorm';
import { CourceEntity } from './entities/cource.entity';
import { Repository } from 'typeorm';
import { AddNewCourceDTO } from './dto/add-new-cource.dto';
import { AuthenticationGuard } from 'utility/guards/authentication.guard';
import { AuthorizeGuard } from 'utility/guards/authorization.guard';
import { Roles } from 'utility/common/user.roles.enum';
import { CurrentUser } from 'utility/decorators/curren-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { extname } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const editFileName = (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtName = extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
    callback(null, filename);
};

@Controller('cources')
export class CourcesController {
    constructor(
        private readonly courcesService: CourcesService,
        @InjectRepository(CourceEntity) private courceRepository: Repository<CourceEntity>,
    ) { }

    @UseGuards(AuthenticationGuard, AuthorizeGuard([Roles.SPECIALIST]))
    @Post('add-new-cource')
    @UseInterceptors(
        FilesInterceptor('img', 5, {
            storage: diskStorage({
                destination: './uploads/courses',
                filename: editFileName,
            }),
            fileFilter: (req, file, callback) => {
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                    return callback(
                        new BadRequestException('Only image files (jpg, jpeg, png, gif) are allowed!'),
                        false,
                    );
                }
                callback(null, true);
            },
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        }),
    )
    async addNewCource(
        @Body() addNewCourceDTO: AddNewCourceDTO,
        @UploadedFiles() files: Array<any>,
        @CurrentUser() currentUser: UserEntity,
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('At least one course image is required.');
        }

        addNewCourceDTO.img = files.map(file => file.filename);
        return await this.courcesService.createCource(addNewCourceDTO, currentUser);
    }

    @Get(':id')
    async getCourceById(@Param('id') id: number) {
        return this.courcesService.findCource(id);
    }

}

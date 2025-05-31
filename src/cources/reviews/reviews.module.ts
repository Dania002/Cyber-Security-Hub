import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewEntity } from "./entities/review.entity";
import { CourcesModule } from "../cources.module";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { CourceEntity } from "../entities/cource.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, CourceEntity]), CourcesModule],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})

export class ReviewsModule { }

import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthenticationGuard } from "utility/guards/authentication.guard";
import { CreateReviewDto } from "./dto/create-review.dto";
import { CurrentUser } from "utility/decorators/curren-user.decorator";
import { UserEntity } from "src/users/entities/user.entity";
import { ReviewsService } from "./reviews.service";

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() currentUser: UserEntity) {
    return await this.reviewsService.createAndUpdateReview(createReviewDto, currentUser);
  }

  @Get(':id')
  async findAllByCourse(@Param('id') id: string) {
    return await this.reviewsService.findAllByCourse(+id);
  }
}

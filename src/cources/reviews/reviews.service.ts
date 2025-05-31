import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReviewEntity } from "./entities/review.entity";
import { Repository } from "typeorm";
import { CourceEntity } from "../entities/cource.entity";
import { CourcesService } from "../cources.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UserEntity } from "src/users/entities/user.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(CourceEntity)
    private readonly courseRepository: Repository<CourceEntity>,
    private readonly courseService: CourcesService,
  ) { }

  async createAndUpdateReview(createReviewDto: CreateReviewDto, currentUser: UserEntity) {
    let course = await this.courseService.findCourse(createReviewDto.courseId);

    if (!course) throw new NotFoundException('Course not found');

    let review = await this.findOneByUserAndCourse(currentUser.id, createReviewDto.courseId);

    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.course = course;
      course.rating = this.addRating(course, review.rating);
      course.totalRatings += 1;
    } else {
      course.rating = await this.editRating(course, createReviewDto.rating);
      review.comment = createReviewDto.comment;
      review.rating = createReviewDto.rating;
    }

    const updatedCourse = await this.courseRepository.save(course);
    const savedReview = await this.reviewRepository.save(review);
    savedReview.course = updatedCourse;

    return this.reviewDataToResponse(savedReview);
  }

  async findAllByCourse(id: number) {
    const course = await this.courseService.findCourse(id);
    if (!course) throw new NotFoundException('Course not found');
    const reviews = await this.reviewRepository.find({
      where: { course: { id: course.id } },
      relations: {
        user: true,
        course: true,
      },
    });
    return await this.allReviewsToReturn(reviews);
  }

  async findOneByUserAndCourse(userId: number, courseId: number) {
    return await this.reviewRepository.findOne({
      where: {
        user: {
          id: userId
        },
        course: {
          id: courseId
        }
      },
      relations: {
        user: true
      }
    });
  }

  async reviewDataToResponse(review: ReviewEntity) {
    return {
      id: review.id,
      comment: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      user: {
        id: review.user?.id,
        name: review.user?.firstName,
        email: review.user?.email,
      },
      course: review.course
        ? {
          id: review.course.id,
          title: review.course.title,
          description: review.course.description,
          rating: review.course.rating,
          totalRatings: review.course.totalRatings,
        }
        : null,
    }
  }

  async allReviewsToReturn(reviews: ReviewEntity[]) {
    return reviews.map(review => ({
      id: review.id,
      comment: review.comment,
      rating: review.rating,
      createdAt: review.createdAt,
      user: review.user ? {
        id: review.user.id,
        name: review.user.firstName,
        email: review.user.email,
      } : null,
      course: review.course ? {
        id: review.course.id,
        title: review.course.title,
        description: review.course.description,
        rating: review.course.rating,
        totalRatings: review.course.totalRatings,
      } : null,
    }));
  }

  addRating(course: CourceEntity, rating: number): number {
    const total = course.totalRatings + 1;
    const oldRating = course.rating;
    const percent = (rating - oldRating) / total;
    const newRating = oldRating + percent;
    return newRating;
  }

  async editRating(course: CourceEntity, newRating: number) {
    const total = course.totalRatings;
    const oldRating = course.rating;
    if (total === 1) {
      var ratingToReturn = newRating;
    } else {
      const percentToDelete = (newRating - oldRating) / (total - 1);
      const editedRating = oldRating - percentToDelete;
      const percentToAdd = (newRating - editedRating) / total;
      var ratingToReturn = editedRating + percentToAdd;
    }
    return ratingToReturn;
  }
}

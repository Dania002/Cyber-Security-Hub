import { CourceEntity } from "src/cources/entities/cource.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity({ name: 'reviews' })
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    comment: string;

    @Column({ type: 'float', nullable: true })
    rating: number;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(type => UserEntity, (user) => user.reviews)
    user: UserEntity;

    @ManyToOne(type => CourceEntity, (course) => course.reviews)
    course: CourceEntity;
}

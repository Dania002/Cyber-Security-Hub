import { UserProfileEntity } from "src/users/entities/userProfile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { ReviewEntity } from "../reviews/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";

@Entity('cources')
export class CourceEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column("text", { array: true, nullable: true })
    img: string[];


    @Column({ type: 'float', default: 0 })
    rating: number;

    @Column({ default: 0 })
    totalRatings: number;

    @ManyToOne(() => UserEntity, (user) => user.course)
    user: UserEntity;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(() => UserProfileEntity, (specialest) => specialest.cources)
    @JoinColumn({ name: "specialestId" })
    specialest: UserProfileEntity;

    @OneToMany(() => ReviewEntity, (reviews) => reviews.course)
    reviews: ReviewEntity[];
}

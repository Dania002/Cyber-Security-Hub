import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";
import { Countries } from "utility/common/country.enum";
import { Roles } from "utility/common/user.roles.enum";
import { UserProfileEntity } from "./userProfile.entity";
import { ReviewEntity } from "src/cources/reviews/entities/review.entity";
import { CourceEntity } from "src/cources/entities/cource.entity";

@Entity('users')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column({ type: 'enum', enum: Countries })
    country: Countries;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Roles })
    role: Roles;

    @Column({ default: false })
    isVerified: boolean;

    @Column({ nullable: true })
    verificationToken: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @OneToOne(() => UserProfileEntity, (profile) => profile.user)
    profile: UserProfileEntity;

    @OneToMany(() => ReviewEntity, (rev) => rev.user)
    reviews: ReviewEntity[];

    @OneToMany(() => CourceEntity, (course) => course.user)
    course: CourceEntity[];
}

import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { Levels } from "utility/common/level.enum";
import { CourceEntity } from "src/cources/entities/cource.entity";

@Entity('profiles')
export class UserProfileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    birthDate: Date;

    @Column({ type: 'enum', enum: Levels })
    level: Levels;

    @Column()
    cv: string;

    @Column()
    certification?: string;

    @Column()
    aboutMe: string;

    @OneToOne(() => UserEntity, (user) => user.profile, { cascade: true })
    @JoinColumn()
    user: UserEntity;

    @OneToMany(() => CourceEntity, (cource) => cource.specialest, { eager: false })
    cources: CourceEntity[];
}

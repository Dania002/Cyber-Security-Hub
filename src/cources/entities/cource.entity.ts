import { UserProfileEntity } from "src/users/entities/userProfile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('cources')
export class CourceEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    img?: string;

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    @ManyToOne(() => UserProfileEntity, (specialest) => specialest.cources)
    @JoinColumn({ name: "specialestId" })
    specialest: UserProfileEntity;
}

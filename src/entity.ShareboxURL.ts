import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from "typeorm";

@Entity()
export class ShareBoxURL {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    @Unique(["url"])
    url: string;

    @Column()
    @Unique(["code"])
    code: string;

    @Column()
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

}


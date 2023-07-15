import {
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

export class Base {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({
        name: "created_at",
        select: false,
    })
    createdAt: Date;
    @UpdateDateColumn({
        name: "updated_at",
        select: false,
    })
    updatedAt: Date;
}

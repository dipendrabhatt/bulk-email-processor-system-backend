import { Column, Entity } from "typeorm";
import { Base } from "../../entities/base.entity";


@Entity('email_template')
export class EmailTemplate extends Base {

    @Column({
        type: "text",
    })
    template: string;
}
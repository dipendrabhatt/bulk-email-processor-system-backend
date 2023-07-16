import { Column, Entity } from "typeorm";
import { Base } from "../../entities/base.entity";


@Entity('email_log')
export class EmailLog extends Base {

    @Column()
    email: string;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    sentTime: Date | null;

    @Column({

    })
    type: string;

}
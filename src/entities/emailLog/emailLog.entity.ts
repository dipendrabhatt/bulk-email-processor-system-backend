import { Column, Entity, ManyToOne } from "typeorm";
import { Base } from "../../entities/base.entity";
import { User } from "../../entities/user/user.entity";


@Entity('email_log')
export class EmailLog extends Base {

    @Column()
    email: string;

    @Column({
        type: 'timestamp',
        nullable: true
    })
    sentTime: Date | null;

    @Column({})
    type: string;

    @ManyToOne(() => User, user => user.emailLogs)
    user: User;

}
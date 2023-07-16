import { Column, Entity, OneToMany } from "typeorm";
import { EmailLog } from "../../entities/emailLog/emailLog.entity";
import { Base } from "../base.entity";

@Entity()
export class User extends Base {

    @Column()
    firstName: string

    @Column({
        nullable: true
    })
    middleName !: string

    @Column()
    lastName: string

    @Column({
        unique: true
    })
    email: string

    @Column()
    password: string

    @Column({
        default: false
    })
    isVerified: boolean

    @OneToMany(() => EmailLog, emailLog => emailLog.user)
    emailLogs: EmailLog[]

}
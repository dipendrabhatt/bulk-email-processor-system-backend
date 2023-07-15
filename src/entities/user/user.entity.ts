import { Column, Entity } from "typeorm";
import { Base } from "../base.entity";

@Entity("user")
export class User extends Base {

    @Column()
    firstNames: string

    @Column()
    middleName !: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({
        default: false
    })
    isVerified: boolean

}
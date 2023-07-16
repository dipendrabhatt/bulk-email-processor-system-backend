import { IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UserDTO {
    @IsNotEmpty()
    @IsString()
    firstName: string

    @IsOptional()
    @IsString()
    middleName: string

    @IsNotEmpty()
    @IsString()
    lastName: string

    @IsNotEmpty()
    @IsString()
    email: string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password: string

}
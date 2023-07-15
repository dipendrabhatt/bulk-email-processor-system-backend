import { ClassConstructor, plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { NextFunction, Request, Response } from 'express'

export default class RequestValidator {
    static validate = <T extends object>(classInstance: ClassConstructor<T>) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            // *Convert body to class instance
            const convertedObject = plainToClass(classInstance, req.body)
            // *Validate the class instance
            const validationMessages: string[] = []
            const errors = await validate(convertedObject, {
                whitelist: true,
                forbidNonWhitelisted: true,
            })

            if (errors.length !== 0) {

                errors.forEach((err) => {
                    if (!err.constraints && err.children) {
                        if (!err.children[0].constraints) return
                        const constraint = err.children[0].constraints[Object.keys(err.children[0].constraints)[0]]
                        if (typeof constraint === 'string') {
                            validationMessages.push(constraint)
                        }
                    } else {
                        if (!err.constraints) return
                        const constraint = err.constraints[Object.keys(err.constraints)[0]]
                        if (typeof constraint === 'string') {
                            validationMessages.push(constraint)
                        }
                    }
                })

                if (validationMessages.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: validationMessages[0]
                    })
                }
            }
            next()
        }
    }
}

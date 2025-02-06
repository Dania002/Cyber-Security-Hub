import { Injectable, NestMiddleware } from "@nestjs/common";
import { isArray } from "class-validator";
import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserService } from "src/users/user.service";
import { UserEntity } from "src/users/entities/user.entity";


declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity | null;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
            req.currentUser = null;
            return next();
        }
        try {
            const token = authHeader.split(' ')[1];

            if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
                throw new Error("ACCESS_TOKEN_SECRET_KEY is not defined");
            }

            const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY as string) as JwtPayload;
            
            if (!decoded.id) {
                throw new Error("Invalid token payload");
            }

            const currentUser = await this.userService.findCurrent(Number(decoded.id));
            req.currentUser = currentUser;
        } catch (err) {
            console.error("JWT Verification Error:", err);
            req.currentUser = null;
        }
        next();
    }
}

interface JwtPayload {
    id: string;
}
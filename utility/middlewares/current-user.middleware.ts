import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UserEntity } from "src/users/entities/user.entity";
import { AuthService } from "src/users/auth.service";
import * as jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserEntity | null;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;

        if (!secretKey) {
            throw new Error("ACCESS_TOKEN_SECRET_KEY is not defined in environment variables.");
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, secretKey) as any;
            req.currentUser = await this.authService.findUserByEmail(payload.email);
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
        }

        next();
    }
}

interface JwtPayload {
    id: string;
}
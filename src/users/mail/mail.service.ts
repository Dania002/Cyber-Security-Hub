import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendVerificationEmail(user: UserEntity) {
        const url = `${process.env.FRONTEND_URL}/auth/verify-email?token=${user.verificationToken}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Verify Your Email',
            text: `Click the link to verify your email: ${url}`,
            html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
        });
    }

    async sendResetPasswordEmail(user: UserEntity) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset Password Code',
            html: `<p>This is your reset password code: <strong>${user.verificationToken}</strong> please copy it!</p>`,
        });
    }
}

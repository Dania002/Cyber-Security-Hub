import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'sandbox.smtp.mailtrap.io',
                port: 2525,
                auth: {
                    user: process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PASS,
                },
            },
            defaults: {
                from: '"Cyber Security Hub" <no-reply@cybersecurityhub.com>',
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})

export class MailModule { }
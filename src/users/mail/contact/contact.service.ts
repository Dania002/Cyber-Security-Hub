import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ContactService {
    constructor(private readonly mailerService: MailerService) { }

    async handleContactForm(name: string, email: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Thank You for Contacting Us',
            html: `<p>Thank you <strong>${name}</strong> for contacting us. Our team will respond to you as soon as possible.</p>`,
        });

        return { message: 'Your message has been received. Thank you!' };
    }

    async handleContactFreelancer(name: string, email: string, message: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Booking An appointment',
            html: `<p>You have book appointment requiest from: <strong>${name}</strong> saying: ${message}</p>`,
        });

        return { message: 'Your booking has been sent fo the freelancer. Thank you!' };
    }
}

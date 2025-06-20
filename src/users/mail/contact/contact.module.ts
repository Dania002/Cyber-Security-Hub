import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [MailerModule],
    controllers: [ContactController],
    providers: [ContactService],
})

export class ContactModule { }

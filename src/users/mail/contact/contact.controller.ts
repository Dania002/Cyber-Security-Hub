import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
    constructor(private readonly contactService: ContactService) { }

    @Post()
    async contact(@Body() createContactDto: CreateContactDto) {
        const { name, email } = createContactDto;
        return this.contactService.handleContactForm(name, email);
    }
}

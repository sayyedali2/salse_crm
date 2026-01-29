
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard'; // Apna Guard import karo
import { SenderVerificationInput } from './dto/sender-verification.input';
import { MailService } from './mail.service';
// Return type ke liye ek simple DTO ya Object bana sakte ho, abhi ke liye String/Boolean return karte hain
import { Organization } from 'src/organization/schemas/organization.schema';

@Resolver()
export class MailResolver {
    constructor(private readonly emailService: MailService){}


}

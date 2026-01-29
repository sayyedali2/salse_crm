import { InputType,Field } from "@nestjs/graphql";
import {IsString,IsOptional} from 'class-validator'


@InputType()
export class UpdateOrganizationInput {
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     name?: string;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     domain?: string;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     logoUrl?: string;
   
     @Field()
     @IsString()
     @IsOptional()
     senderStatus?: boolean;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     senderEmail?: string;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     senderName?: string;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     sendgridSenderId?: string;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     inboundSlug?: string;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     email?: string;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     ownerName?: string;
   
     @Field({ nullable: true })
     @IsString()
     @IsOptional()
     ownerPhone?: string;

    
}

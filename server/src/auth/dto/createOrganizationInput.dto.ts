import { InputType, Field, ID } from "@nestjs/graphql";
import {IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator'

@InputType()
export class CreateOrganizationInput {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    domain: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    phone: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    password: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    ownerName: string;

    @Field()
    @IsOptional()
    @IsString()
    logoUrl: string;
}
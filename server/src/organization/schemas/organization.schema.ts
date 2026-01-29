import { ObjectType, Field, ID } from '@nestjs/graphql';
import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';

export type OrganizationType = Organization & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Organization {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true, unique: true })
  @Field()
  domain: string;

  @Prop()
  @Field({ nullable: true })
  logoUrl?: string;



  @Prop({ default: null })
  @Field({ nullable: true })
  senderEmail?: string;

  @Prop({ default: null })
  @Field({ nullable: true })
  senderName?: string;

  @Prop({default:null})
  @Field({nullable:true})
  apiKey?:string

  @Prop()
  @Field({nullable:true})
  iv?:string

  @Prop({type:Boolean,default:false})
  @Field(()=>Boolean)
  emailServiceStatus?: boolean;

  @Prop({ required: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  ownerName: string;

  @Prop({ required: true })
  @Field()
  phone: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

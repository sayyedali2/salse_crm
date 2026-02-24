import {InputType,Field} from '@nestjs/graphql';

@InputType()
export class VapiAgentConfigureInput {
    @Field()
    vapiApikey:string;

    @Field()
    vapiAssistantId:string;

    @Field({nullable:true})
    vapiPhoneNumberId?:string;
}
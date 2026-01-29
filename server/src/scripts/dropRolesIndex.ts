import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module'; // Adjust path if needed
import { getModelToken } from '@nestjs/mongoose';
import { Roles } from 'src/roles/schemas/role.schema'; // Adjust path
import { Model } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rolesModel = app.get<Model<any>>(getModelToken(Roles.name));

  console.log('Dropping indexes for Roles collection...');
  try {
    await rolesModel.collection.dropIndexes();
    console.log('Successfully dropped all indexes on Roles collection.');
  } catch (error) {
    console.error('Error dropping indexes:', error);
  }

  await app.close();
}
bootstrap();

import {
  Controller,
  UseInterceptors,
  Post,
  UseGuards,
  UploadedFile,
  Req,
  BadRequestException,
  Body,
  UploadedFiles,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Permission } from 'src/common/decorator/permission/permission.decorator';
import { PermissionGuard } from 'src/common/decorator/permission/permission.gaurd';

@Controller('leads/import')
export class LeadsController {
  logger: any;
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @UseGuards(AuthGuard, PermissionGuard)
  // @Permission('LEADS_IMPORT')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    const result = await this.leadsService.importLeadsFromExcel(
      file.buffer,
      req.user.organizationId,
      req.user._id,
    );
    return {
      message: `Successfully processed ${result.count} leads`,
      ...result,
    };
  }

}

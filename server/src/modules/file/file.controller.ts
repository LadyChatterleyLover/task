import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { Readable } from 'node:stream'
import { AuthGuard } from '@nestjs/passport'
import { UploadFile } from './dto/file.dto'

/**
 * 将buffer转为Stream流
 * @param binary file.buffer
 * @returns
 */
function bufferToStream(binary) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary)
      this.push(null)
    },
  })
  return readableInstanceStream
}

@Controller('file')
@UseGuards(AuthGuard('jwt'))
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: UploadFile, @Req() req) {
    const name = file.originalname
    const stream = bufferToStream(file.buffer)
    return this.fileService.upload(name, stream, file, req.user.user_id)
  }
}

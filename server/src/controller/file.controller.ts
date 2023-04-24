import {
  Controller,
  Inject,
  Post,
  Patch,
  Body,
  Param,
  Files,
} from '@midwayjs/core'
import { FileService } from '../service/file.service'

@Controller('/file')
export class FileController {
  @Inject()
  ctx

  @Inject()
  fileService: FileService

  @Post('/upload')
  async upload(@Files() files) {
    const file = files[0]
    const name = file.filename
    return this.fileService.upload(
      name,
      file,
      this.ctx.userContext._id,
      file._ext
    )
  }

  @Post()
  async findAll(@Body() params: { name: string; dirId: number }) {
    return this.fileService.findAll(params.name, params.dirId)
  }

  @Post('/createDir')
  async createDir(@Body() params: { name: string }) {
    return this.fileService.createDir(params.name, this.ctx.userContext._id)
  }

  @Post('/patchDelete')
  async patchDelete(@Body() params: { ids: number[] }) {
    return this.fileService.patchDelete(params.ids)
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateTaskDto) {
    return this.fileService.updateFile(+id, updateTaskDto)
  }
}

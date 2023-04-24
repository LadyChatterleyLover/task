import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Param,
  Patch,
  Del,
} from '@midwayjs/core'
import { ProjectService } from '../service/project.service'

@Controller('/project')
export class ProjectController {
  @Inject()
  projectService: ProjectService

  @Post('/create')
  async create(@Body() createProjectDto) {
    return await this.projectService.create(createProjectDto)
  }

  @Get('/getList')
  async findAll() {
    return await this.projectService.findAll()
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return await this.projectService.findOne(+id)
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateProjectDto) {
    return await this.projectService.update(+id, updateProjectDto)
  }

  @Del(':id')
  async remove(@Param('id') id: string) {
    return await this.projectService.remove(+id)
  }
}

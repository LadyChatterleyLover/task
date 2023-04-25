import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { ProjectService } from './project.service'
import { ProjectDto } from './dto/project.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('project')
@UseGuards(AuthGuard('jwt'))
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  async create(@Body() createProjectDto: ProjectDto) {
    return await this.projectService.create(createProjectDto)
  }

  @Get('getList')
  async findAll() {
    return await this.projectService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.projectService.findOne(+id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto) {
    return await this.projectService.update(+id, updateProjectDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projectService.remove(+id)
  }
}

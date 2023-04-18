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
import { TaskService } from './task.service'
import { TaskDto } from './dto/task.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: TaskDto) {
    return await this.taskService.create(createTaskDto)
  }

  @Post('list')
  async findAll(
    @Body() params: { current: number; size: number; keyword: string },
  ) {
    return await this.taskService.findAll(
      params.current,
      params.size,
      params.keyword,
    )
  }

  @Post('detail')
  async findOne(
    @Body()
    params: {
      projectId: number
      userId: number
      current: number
      size: number
      keyword: string
    },
  ) {
    return this.taskService.findOne(
      params.projectId,
      params.userId,
      params.current,
      params.size,
      params.keyword,
    )
  }

  @Post('search')
  async search(@Body() params: { keyword: string }) {
    return this.taskService.search(params.keyword)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto) {
    return this.taskService.update(+id, updateTaskDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.taskService.remove(+id)
  }
}

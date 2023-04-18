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

  @Get()
  async findAll() {
    return await this.taskService.findAll()
  }

  @Post('detail')
  async findOne(@Body() params: { projectId: number; userId: number }) {
    return this.taskService.findOne(params.projectId, params.userId)
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

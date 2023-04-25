import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common'
import { TaskService } from './task.service'
import { TaskDto } from './dto/task.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('task')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() createTaskDto: TaskDto, @Req() req) {
    return await this.taskService.create({
      ...createTaskDto,
      users: [...(createTaskDto.users = []), req.user.id],
    })
  }

  @Post('list')
  async findAll(
    @Body()
    params: {
      current: number
      size: number
      keyword: string
    },
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
      params.current,
      params.size,
      params.keyword,
    )
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

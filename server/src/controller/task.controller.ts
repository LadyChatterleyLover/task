import {
  Controller,
  Inject,
  Post,
  Patch,
  Del,
  Body,
  Param,
} from '@midwayjs/core'
import { TaskService } from '../service/task.service'

@Controller('/task')
export class TaskController {
  @Inject()
  taskService: TaskService

  @Post()
  async create(@Body() createTaskDto) {
    return await this.taskService.create(createTaskDto)
  }

  @Post('/list')
  async findAll(
    @Body()
    params: {
      current: number
      size: number
      keyword: string
    }
  ) {
    return await this.taskService.findAll(
      params.current,
      params.size,
      params.keyword
    )
  }

  @Post('/detail')
  async findOne(
    @Body()
    params: {
      projectId: number
      userId: number
      current: number
      size: number
      keyword: string
    }
  ) {
    return this.taskService.findOne(
      params.projectId,
      params.userId,
      params.current,
      params.size,
      params.keyword
    )
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateTaskDto) {
    return this.taskService.update(+id, updateTaskDto)
  }

  @Del('/:id')
  async remove(@Param('id') id: string) {
    return this.taskService.remove(+id)
  }
}

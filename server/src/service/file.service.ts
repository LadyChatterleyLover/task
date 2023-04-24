import { Inject, Provide } from '@midwayjs/decorator'
import { OSSService } from '@midwayjs/oss'
import { InjectEntityModel } from '@midwayjs/typeorm'
import { Like, Repository } from 'typeorm'
import { User } from '../entity/user.entity'
import { File } from '../entity/file.entity'

export interface UploadFile {
  fieldname: string
  data: string
  filename: string
  mimeType: string
  _ext: string
}

@Provide()
export class FileService {
  @InjectEntityModel(File)
  fileRepository: Repository<File>

  @InjectEntityModel(User)
  userRepository: Repository<User>

  @Inject()
  ossService: OSSService

  async upload(name: string, file: UploadFile, user_id: string, ext: string) {
    const url = await this.uploadFile(name, file.data)
    const res = await this.fileRepository.save({
      name,
      ext,
      url,
      user_id,
    })
    if (res) {
      return {
        code: 200,
        msg: '上传成功',
        data: res,
      }
    } else {
      return {
        code: 500,
        msg: '上传失败',
      }
    }
  }

  async uploadFile(name: string, file: any) {
    let res
    try {
      res = await this.ossService.put(name, file)
      // 将文件设置为公共可读
      await this.ossService.putACL(name, 'public-read')
    } catch (error) {
      console.log(error)
    }
    return res.url
  }

  async createDir(name: string, user_id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: +user_id,
      },
    })
    const existDir = await this.fileRepository.findOne({
      where: {
        name,
        isDir: true,
      },
    })
    if (existDir) {
      return {
        code: 500,
        msg: '文件夹已存在',
      }
    }
    const data = await this.fileRepository.save({
      name,
      isDir: true,
      user,
    })
    if (data) {
      return {
        code: 200,
        msg: '创建成功',
        data,
      }
    } else {
      return {
        code: 500,
        msg: '创建失败',
      }
    }
  }

  async findAll(name = '', dirId: number) {
    const data = await this.fileRepository.find({
      where: {
        name: Like(`%${name}%`),
        dirId,
      },
      order: {
        isDir: 'DESC',
      },
      relations: ['user'],
    })
    return {
      code: 200,
      msg: '查询成功',
      data,
    }
  }

  async patchDelete(ids: number[]) {
    const res = await this.fileRepository
      .createQueryBuilder('file')
      .delete()
      .whereInIds(ids)
      .execute()
    if (res) {
      return {
        code: 200,
        msg: '删除成功',
      }
    } else {
      return {
        code: 500,
        msg: '删除失败',
      }
    }
  }

  async updateFile(id: number, updateFileDto) {
    const data = await this.fileRepository.findOne({
      where: {
        id,
      },
    })
    const newData = Object.assign(data, { ...updateFileDto })
    if (updateFileDto.users && updateFileDto.users.length) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .whereInIds(updateFileDto.users)
        .getMany()
      newData.users = users
    }
    const res = await this.fileRepository.save(newData)
    if (res) {
      return {
        code: 200,
        msg: '修改成功',
      }
    } else {
      return {
        code: 500,
        msg: '修改失败',
      }
    }
  }
}

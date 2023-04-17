import { Injectable } from '@nestjs/common'
import * as OSS from 'ali-oss'
import { Readable } from 'node:stream'
import client from '../../config/oss'
import { InjectRepository } from '@nestjs/typeorm'
import { File } from './entities/file.entity'
import { Repository } from 'typeorm'
import { UploadFile } from './dto/file.dto'

@Injectable()
export class FileService {
  public client
  constructor(
    @InjectRepository(File) private readonly fileModel: Repository<File>,
  ) {
    this.client = new OSS(client)
  }
  async upload(
    name: string,
    stream: Readable,
    file: UploadFile,
    user_id: string,
  ) {
    const size = file.size
    const ext = file.mimetype.split('/')[1]
    const url = await this.uploadFile(name, stream)
    const res = await this.fileModel.create({
      name,
      size,
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

  async uploadFile(name: string, stream: Readable) {
    let res
    try {
      res = await this.client.putStream(name, stream)
      // 将文件设置为公共可读
      await this.client.putACL(name, 'public-read')
    } catch (error) {
      console.log(error)
    }
    return res.url
  }
}

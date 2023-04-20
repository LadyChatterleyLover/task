import { post, postFormData } from '../../request'

export default {
  upload(params: { file: File }) {
    return postFormData('/file/upload', params)
  }
}

import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProjectItem } from '../../types/project'
import api from '../../api'
import ProjectHeader from '../../components/project/ProjectHeader'
import ProjectTable from '../../components/project/ProjectTable'

const Project = () => {
  const [searchParams] = useSearchParams()
  const [project, setProject] = useState<ProjectItem>()
  const [id, setId] = useState(-1)

  const getProject = (value: string) => {
    api.project.getProject(+value).then((res) => {
      if (res.code === 200) {
        setProject(res.data[0])
      }
      console.log(res.data[0])
    })
  }

  useEffect(() => {
    const value = searchParams.get('id')!
    setId(+value)
    getProject(value)
  }, [searchParams])

  return (
    <div className="p-[30px]">
      <ProjectHeader project={project!} />
      <div>
        <ProjectTable project={project} />
      </div>
    </div>
  )
}

export default Project

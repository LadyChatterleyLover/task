import React, { useRef } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProjectItem } from '../../types/project'
import api from '../../api'
import ProjectHeader from '../../components/project/ProjectHeader'
import ProjectTable from '../../components/project/ProjectTable'

const Project = () => {
  const [searchParams] = useSearchParams()
  const [project, setProject] = useState<ProjectItem>()
  const [keyword, setKeyword] = useState('')
  const tableRef = useRef<{ getTaskDetail: () => void }>()

  const getProject = (value: string) => {
    api.project.getProject(+value).then((res) => {
      if (res.code === 200) {
        setProject(res.data[0])
      }
    })
  }

  const searchConfirm = () => {
    tableRef.current?.getTaskDetail()
  }

  useEffect(() => {
    const value = searchParams.get('id') as string
    getProject(value)
  }, [searchParams])

  return (
    <div className="p-[30px] h-full w-full">
      <ProjectHeader
        keyword={keyword}
        setKeyword={setKeyword}
        project={project as ProjectItem}
        getProject={getProject}
        searchConfirm={searchConfirm}
      />
      <div className="mt-5  h-full w-full">
        <ProjectTable ref={tableRef} keyword={keyword} project={project as ProjectItem} />
      </div>
    </div>
  )
}

export default Project

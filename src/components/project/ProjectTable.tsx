import React from 'react'
import { ProjectItem } from '../../types/project'

interface Props {
  project: ProjectItem
}

const ProjectTable = (props: Props) => {
  const { project } = props
  return <div>ProjectTable</div>
}

export default ProjectTable

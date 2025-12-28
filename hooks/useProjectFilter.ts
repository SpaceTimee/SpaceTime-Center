import { useMemo } from 'react'
import { projects } from '../data'
import { ProjectStatus, type Project } from '../types'

export function useProjectFilter() {
  return useMemo(() => {
    const groups: Record<ProjectStatus, Project[]> = {
      [ProjectStatus.InProgress]: [],
      [ProjectStatus.Completed]: [],
      [ProjectStatus.Planned]: []
    }

    projects.forEach((p) => {
      groups[p.status].push(p)
    })

    return groups
  }, [])
}

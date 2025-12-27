import { useMemo } from 'react'
import { ProjectStatus } from '../types'
import type { Project } from '../types'
import { projects } from '../data'

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

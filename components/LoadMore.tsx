"use client"

import { useRouter } from "next/navigation"
import Button from "./Button"

type Props = {
  endCursor: number
  projectsPerPage: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

const LoadMore = ({ endCursor, projectsPerPage, hasPreviousPage, hasNextPage }: Props) => {
  const router = useRouter()

  const handleNavigation = (direction: string) => {
    console.log(!endCursor)
    console.log('end ' + endCursor + ' perpage ' + projectsPerPage + ' prev ' + hasPreviousPage + ' next ' + hasNextPage)
    const currentParams = new URLSearchParams(window.location.search)
    if (direction === 'prev' && hasPreviousPage) {
      currentParams.delete('endcursor')
    } else if(direction === 'next' && hasNextPage) {
      for(var i=0; i<projectsPerPage; i++) {
        endCursor++
      }
      currentParams.set('endcursor', (endCursor).toString())
    }
    const newSearchParams = currentParams.toString()
    const newPathname = `${window.location.pathname}?${newSearchParams}`
    router.push(newPathname)
  }

  return (
    <div className="w-full flexCenter gap-5 mt-10">
      {hasPreviousPage && (
        <Button title="First Page" handleClick={() => handleNavigation('prev')}/>
      )}
      {hasNextPage && (
        <Button title="Next" handleClick={() => handleNavigation('next')}/>
      )}
    </div>
  )
}

export default LoadMore
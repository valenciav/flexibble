import { ProjectsSearch } from "@/common.types"
import { getUserProjects } from "@/lib/actions"
import Image from "next/image"
import Link from "next/link"

type Props = {
  userId: number
  projectId: number
}

const RelatedProjects = async ({ userId, projectId }: Props) => {

  const result = (await getUserProjects(userId.toString())).rows as ProjectsSearch[]
  const filtered = result.filter((project) => (project.project_id !== projectId)) || []

  if(filtered.length === 0) return null

  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p>More by {filtered[0].name}</p>
        <Link
          href={`/profile/${filtered[0].user_id}`}
          className='text-primary-purple text-base'
        >
          View All
        </Link>
      </div>
      <div className="related_projects-grid">
        {filtered.map((project) => (
          <div className="flexCenter related_project-card drop-shadow-card">
            <Link
              href={`/project/${project.project_id}`}
              className="flexCenter group relative w-full h-full"
            >
              <Image
                src={project.image}
                width={414}
                height={314}
                className="w-full h-full object-cover rounded-2xl"
                alt="Project Image"
              />
              <div className="hidden group-hover:flex related_project-card_title">
                <p className='w-full'>{project.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RelatedProjects
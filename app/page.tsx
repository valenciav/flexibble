import { ProjectsSearch } from "@/common.types"
import Categories from "@/components/Categories"
import LoadMore from "@/components/LoadMore"
import ProjectCard from "@/components/ProjectCard"
import { fetchProjects, projectCount } from "@/lib/actions"

type SearchParams = {
    category?: string
    endcursor?: number
}

type Props = {
    searchParams: SearchParams
}

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 0

const Home = async ({searchParams: {category, endcursor}} : Props) => {
    const projectsPerPage = 8
    const data = (await fetchProjects(projectsPerPage, category, endcursor)).rows as ProjectsSearch[]
    const projectsToDisplay = data || []

    if(projectsToDisplay.length === 0) {
        return (
            <section className="flexStart flex-col paddings">
                <Categories/>
                <p className="no-result-text text-center">No projects found, go create some first.</p>
            </section>
        )
    }
    var numOfProjects = (await projectCount(category)).rows[0].count-1
    if(!endcursor) endcursor = 0

    return (
        <section className="flex-start flex-col paddings mb-16">
            <Categories />
            <section className="projects-grid">
                {projectsToDisplay.map((node) => (
                    <ProjectCard
                        key={node?.project_id}
                        id={node?.project_id.toString()}
                        image={node?.image}
                        title={node?.title}
                        name={node?.name}
                        avatarUrl={node?.avatarurl}
                        userId={node?.user_id.toString()}
                    />
                ))}
            </section>
            <LoadMore
                endCursor={endcursor || 0}
                projectsPerPage={projectsPerPage}
                hasPreviousPage={endcursor !== 0}
                hasNextPage={projectsToDisplay.length <= numOfProjects && numOfProjects > endcursor}
            />
        </section>
    )
}

export default Home
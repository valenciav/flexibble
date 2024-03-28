import { ProjectsSearch } from "@/common.types"
import Categories from "@/components/Categories"
import ProjectCard from "@/components/ProjectCard"
import { fetchProjects } from "@/lib/actions"

const Home = async () => {
    const data = (await fetchProjects()).rows as ProjectsSearch[]

    const projectsToDisplay = data || []

    if(projectsToDisplay.length === 0) {
        return (
            <section className="flexStart flex-col paddings">
                Categories
                <p className="no-result-text text-center">No projects found, go create some first.</p>
            </section>
        )
    }

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
            <h1>LoadMore</h1>
        </section>
    )
}

export default Home
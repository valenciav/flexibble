import { ProjectsSearch } from "@/common.types"
import Modal from "@/components/Modal"
import ProjectForm from "@/components/ProjectForm"
import { getProjectDetails } from "@/lib/actions"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

const EditProject = async ({params: {id}}: {params: {id: string}}) => {
  const session = await getCurrentUser()
  if(!session?.user) redirect('/')

  const result = (await getProjectDetails(id)).rows as ProjectsSearch[]

  if(!result || !result[0]) {
    return (<p>Failed to fetch project information</p>)
  }

  return (
    <Modal>
      <h3 className="modal-head-text">Edit Project</h3>
      <ProjectForm type="edit" session={session} project={result[0]}/>
    </Modal>
  )
}

export default EditProject
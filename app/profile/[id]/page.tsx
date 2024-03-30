import { ProjectsSearch } from "@/common.types"
import ProfilePage from "@/components/ProfilePage"
import { getUserProjects } from "@/lib/actions"

type Props = {
  params: {
    id: string
  }
}

const UserProfile = async ({ params }: Props) => {
  var result = (await getUserProjects(params.id))
  if(!result) {
    return <p className="no-result-text">Failed to fetch user info</p>
  }
  result = result.rows as ProjectsSearch[]
  return (
    <ProfilePage data={result}/>
  )
}

export default UserProfile
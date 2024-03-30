import { ProjectForm } from "@/common.types"

const isProduction = process.env.NODE_ENV === 'production'
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000'

const makePGRequest = async (query: string)  => {
  try {
    let result = await fetch(`${serverUrl}/api/query`, {
      method: "POST",
      body: JSON.stringify({query:query}),
      // cache: 'no-store'
    }
    )
    return(result)
  } catch (error) {
    throw error
  }
}

export const getUser = async (email: string) => {
  var query = 'SELECT * FROM users WHERE email = \'' + email + '\''
  var res = await makePGRequest(query)
  return res.json()
}

export const createUser = (name: string, email: string, avatarUrl: string) => {
  return makePGRequest('INSERT INTO users (name, email, avatarUrl) VALUES (\'' + name + '\', \'' + email + '\', \'' +  avatarUrl + '\');')
}

export const fetchToken = async () => {
  try {
    const response = await fetch(`${serverUrl}/api/auth/token`)
    return response.json()
  } catch(error) {
    throw error
  }
}

export const uploadImage = async (imagePath: string) => {
  try {
    const response = await fetch(`${serverUrl}/api/upload`, {
      method: 'POST',
      body: JSON.stringify({ path: imagePath })
    })
    return response.json()
  } catch (error) {
    throw error
  }
}

export const createProject = async (form: ProjectForm, creatorId: string, token:string) => {
  const imageUrl = await uploadImage(form.image)

  if(imageUrl.url) {
    console.log('creatorId' + creatorId)
    var query = 'INSERT INTO projects (title, description, image, liveSiteUrl, githubUrl, category, createdBy) VALUES (\'' 
    + form.title + '\', \''
    + form.description + '\', \''
    + imageUrl.url + '\', \''
    + form.liveSiteUrl + '\', \''
    + form.githubUrl + '\', \''
    + form.category + '\', '
    + parseInt(creatorId, 10) + ')'
    return makePGRequest(query)
  }
}

export const editProject = async (form: ProjectForm, projectId:number, token:string) => {

  function isBase64DataURL(value:string) {
    const base64Regex = /^data:image\/[a-z]+;base64,/
    return base64Regex.test(value)
  }

  let updatedForm = {...form}
  const updateImage = isBase64DataURL(form.image)

  if(updateImage) {
    const imageUrl = await uploadImage(form.image)
    if(imageUrl.url) {
      updatedForm = {
        ...form,
        image:imageUrl.url
      }
    }
  }

  var query = 'UPDATE projects '
  + 'SET title = \'' + updatedForm.title
  + '\', description = \'' + updatedForm.description
  + '\', image = \'' + updatedForm.image
  + '\', liveSiteUrl = \'' + updatedForm.liveSiteUrl
  + '\', githubUrl = \'' + updatedForm.githubUrl
  + '\', category = \'' + updatedForm.category
  + '\' WHERE project_id = ' + projectId

  return makePGRequest(query)
}

export const fetchProjects = async (limit: number, category?: string | null, endcursor?: number | null) => {
  let query = 'SELECT * FROM projects JOIN users ON createdBy = user_id'
  if(category) query+=' WHERE category = \'' + category + '\''
  query+=' ORDER BY project_id LIMIT ' + limit
  if(endcursor) query+= ' OFFSET ' + endcursor
  return (await makePGRequest(query)).json()
}

export const projectCount = async (category?: string) => {
  let query = 'SELECT COUNT(*) FROM projects'
  if(category) query+=' WHERE category = \'' + category + '\''
  return (await makePGRequest(query)).json()
}

export const getProjectDetails = async (id: string) => {
  let query = 'SELECT * FROM projects JOIN users ON createdBy = user_id WHERE project_id = ' + id
  return (await makePGRequest(query)).json()
}

export const getUserProjects = async (id: string) => {
  let query = 'SELECT * FROM projects JOIN users ON createdBy = user_id WHERE user_id = ' + id
  return (await makePGRequest(query)).json()
}

export const deleteProject = async (id: string, token:string) => {
  let query = 'DELETE FROM projects WHERE project_id = ' + id
  return makePGRequest(query)
}
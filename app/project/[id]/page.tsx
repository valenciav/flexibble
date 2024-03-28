import { ProjectsSearch } from '@/common.types'
import Modal from '@/components/Modal'
import ProjectActions from '@/components/ProjectActions'
import RelatedProjects from '@/components/RelatedProjects'
import { getProjectDetails } from '@/lib/actions'
import { getCurrentUser } from '@/lib/session'
import Image from 'next/image'
import Link from 'next/link'


const Project = async ({ params: {id} }: { params: {id: string}} ) => {

  const session = await getCurrentUser()
  const result = (await getProjectDetails(id)).rows as ProjectsSearch[]
  
  if(!result || !result[0]) {
    return (<p>Failed to fetch project information</p>)
  }

  const project = result[0]



  const renderLink = () => {
    return '/profile/' + project.createdby
  }

  return (
    <Modal>
      <section className='flexBetween gap-y-8 max-w-4xl max-xs:flex-col w-full'>
        <div className='flex-1 flex items-start gap-5 w-full max-xs:flex-col'>
          <Link href={renderLink()}>
            <Image
              src={project.avatarurl}
              width={50}
              height={50}
              className='rounded-full'
              alt='Profile Image'
            />
          </Link>
          <div className='flex-1 flexStart flex-col gap-1'>
            <p className='self-start text-lg font-semibold'>{project.title}</p>
            <div className='user-info'>
              <Link href={renderLink()}>
                {project.name}
              </Link>
              <Image src="/dot.svg" width={4} height={4} alt='dot'/>
              <Link href={`/?category=${project.category}`} className='text-primary-purple font-semibold'>
                {project.category}
              </Link>
            </div>
          </div>
        </div>
        {session?.user?.email === project.email && (
          <div className='flex justify-end items-center gap-2'>
            <ProjectActions
              projectId={project.project_id}
            />
          </div>
        )}
      </section>

      <section>
        <Image
          src={project.image}
          width={1064}
          height={798}
          className='object-cover rounded-2xl'
          alt='poster'
        />
      </section>

      <section className='flexCenter flex-col mt-20'>
        <p className='max-w-5xl text-xl font-normal'>
          {project.description}
        </p>
        <div className='flex flex-wrap mt-5 gap-5'>
          <Link href={project.githuburl} target='_blank' rel='noreferrer' className='flexCenter gap-2 tex-sm font-medium text-primary-purple'>
            <span className='underline'>Github</span>
          </Link>
          <Image src='/dot.svg' width={4} height={4} alt='dot'/>
          <Link href={project.livesiteurl} target='_blank' rel='noreferrer' className='flexCenter gap-2 tex-sm font-medium text-primary-purple'>
            <span className='underline'>Live Site</span>
          </Link>
        </div>
      </section>

      <section className='flexCenter w-full gap-8 mt-28'>
        <span className='w-full h-0.5 bg-light-white-200'/>
        <Link href={renderLink()} className='min-w-[82px] h-[82px]'>
          <Image
            src={project.avatarurl}
            className='rounded-full'
            width={82}
            height={82}
            alt='Profile Image'
          />
        </Link>
        <span className='w-full h-0.5 bg-light-white-200'/>
      </section>

      <RelatedProjects userId={project.user_id} projectId={project.project_id}/>
    </Modal>
  )
}

export default Project
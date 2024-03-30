import { ProjectInterface, ProjectsSearch, UserProfile } from '@/common.types'
import Image from 'next/image'

import Link from 'next/link'
import Button from "./Button";
import ProjectCard from './ProjectCard';

type Props = {
    data: ProjectsSearch[];
}

const ProfilePage = ({ data }: Props) => (
    <section className='flexCenter flex-col max-w-10xl w-full mx-auto paddings'>
        <section className="flexBetween max-lg:flex-col gap-10 w-full">
            <div className='flex items-start flex-col w-full'>
                <Image src={data[0]?.avatarurl} width={100} height={100} className="rounded-full" alt="user image" />
                <p className="text-4xl font-bold mt-10">{data[0]?.name}</p>
                <p className="md:text-5xl text-3xl font-extrabold md:mt-10 mt-5 max-w-lg">I’m Software Engineer at JSM 👋</p>
                
                <div className="flex mt-8 gap-5 w-full flex-wrap">
                    <Button 
                        title="Follow" 
                        leftIcon="/plus-round.svg" 
                        bgColor="bg-light-white-400 !w-max" 
                        textColor="text-black-100" 
                    />
                    <Link href={`mailto:${data[0]?.email}`}>
                        <Button title="Hire Me" leftIcon="/email.svg" />
                    </Link>
                </div>
            </div>

            {data?.length > 0 ? (
                <Image
                    src={data[0].image}
                    alt="project image"
                    width={739}
                    height={554}
                    className='rounded-xl object-contain'
                />
            ) : (
                <Image
                    src="/profile-post.png"
                    width={739}
                    height={554}
                    alt="project image"
                    className='rounded-xl'
                />
            )}
       </section>

       <section className="flexStart flex-col lg:mt-28 mt-16 w-full">
           <p className="w-full text-left text-lg font-semibold">Recent Work</p>
           
           <div className="profile_projects">
                {data?.map(
                    (node) => (
                        <ProjectCard
                            key={`${node?.project_id}`}
                            id={node?.project_id.toString()}
                            image={node?.image}
                            title={node?.title}
                            name={node.name}
                            avatarUrl={node.avatarurl}
                            userId={node.user_id.toString()}
                        />
                    )
                )}
            </div>
       </section>
   </section>
)

export default ProfilePage
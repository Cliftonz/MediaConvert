import { SignUp } from '@clerk/nextjs'

export default async function signup(){
   return (
       <div className={"flex items-center justify-center h-screen"}>
         <SignUp/>
       </div>
   )
}

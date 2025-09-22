import ChangeProfilePicture from "./ChangeProfilePicture"
import EditProfile from "./EditPorfile"
import DeleteAccount from "./DeleteAccount"
import UpdatePassword from "./UpdatePassword"


export default function Setting (){
    return(
        <>
        <h1 className="mb-14 text-3xl font-medium text-richblack-5 font-boogaloo text-center">Edit Profile</h1>
        {/* Change Profile Picture */}
         <ChangeProfilePicture />

         <EditProfile/>

         <UpdatePassword/>

         <DeleteAccount/>
        </>
    )
}



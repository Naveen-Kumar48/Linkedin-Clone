import { Router } from "express";
import multer from "multer";
import { login, register, uploadprofilepic ,updateUserProfile,getUserProfile, updateProfileData, getAllUsersProfile, downloadProfile} from "../controllers/user.controller.js";
import { get } from "mongoose";
const router = Router();




const storage=multer.diskStorage({

    destination:function(req,file,cb){
        cb(null,'uploads');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

const upload=multer({storage:storage});

router.route('/uploadprofilepic').post(upload.single('profilePicture'),uploadprofilepic);


router.route('/register').post(register)
router.route('/login').post(login) //~add login controller
router.route('/userupdate').post(updateUserProfile)
router.route('/getuser_profile').get(getUserProfile)
router.route('/updateprofile_data').post(updateProfileData)
router.route('/user/get_allusers').get(getAllUsersProfile);
router.route('/user/download_resume').get(downloadProfile)
router.route('/user/send_connection_request')
export default router;
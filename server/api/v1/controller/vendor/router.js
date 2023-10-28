import Express from "express";
import controller from "./controller"
import common from "../../../../helper/auth"
import multer from '../../../../helper/multer'
const router=Express.Router();



router.get('/vendorlogin',controller.login);
router.get('/viewprofile',common.auth,controller.viewprofile);
router.put('/resendotp',controller.resendOTP);
router.put('/resetpwd',common.auth,controller.resetpassword);
router.put('/editprofile',common.auth,controller.editprofile);
router.put('/profilePicture',common.auth,controller.imageUpload)



export default router;
import Express from "express";
import controller from "./controller"
import common from "../../../../helper/auth"
const router=Express.Router()



router.post('/userSignUp',controller.userSignUp);
router.put("/verifyotp",controller.otpVerification);
router.get("/login",controller.login);
router.get("/getprofile",common.auth,controller.getData);
router.put("/editProfile",common.auth,controller.editprofile);
router.put("/resendotp",controller.resendOTP);
router.put("/emailverify/:email",controller.emailVerify);
router.put("/forgetpassword",controller.forgetPassword);
router.put("/resetpassword",common.auth,controller.resetPassword);
export default router;
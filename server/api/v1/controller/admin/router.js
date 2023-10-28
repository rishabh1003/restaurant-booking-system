import Express from "express";
import controller from "./controller"
import common from "../../../../helper/auth"
const router=Express.Router();



router.get('/adminLogin',controller.adminlogin);
router.post('/createVendor',common.auth,controller.createVendor);
router.get("/getAdminData",common.auth,controller.getData);
router.get("/getalldata",common.auth,controller.getAllvendors);


export default router;
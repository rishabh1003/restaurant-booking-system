import Express from "express";
import controller from "./controller"
import common from "../../../../helper/auth"
import multer from '../../../../helper/multer'
const router=Express.Router();



router.post('/createSlot',common.auth,controller.createSlot)


export default router;
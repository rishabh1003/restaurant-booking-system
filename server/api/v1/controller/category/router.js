import Express from "express";
import controller from "./controller"
import common from "../../../../helper/auth"
const router=Express.Router();

router.post('/createCategory',common.auth,controller.createCategory);
router.delete('/deletecategory',common.auth,controller.deletecategory);
router.get('/getData',common.auth,controller.findCategory);



export default router;
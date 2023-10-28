import Express from "express";
import controller from "./controller"
import common from "../../../../helper/auth"

const router=Express.Router();

router.post('/createShop',common.auth,controller.createshop);
router.delete('/deleteshop',common.auth,controller.deleteShop);
router.put('/updateshop',common.auth,controller.updateshop);
router.get('/getdata',common.auth,controller.getData);

export default router;
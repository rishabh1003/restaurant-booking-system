import Express from "express";
import controller from "./controller"
import common from "../../../../helper/auth"
const router=Express.Router();


router.post('/createProduct',common.auth,controller.createProduct)
router.get("/getproductList",common.auth,controller.getAllProduct);
router.get('/productSet',common.auth,controller.getProductwithcategoryAndShop);
router.delete('/deleteproduct',common.auth,controller.deleteProduct)
router.put('/likesAndDislike',common.auth,controller.likedAndDisliked)
export default router;
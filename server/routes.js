import admin from './api/v1/controller/admin/router'
import vendor from './api/v1/controller/vendor/router'
import restaurant from './api/v1/controller/restaurant/router'
import category from './api/v1/controller/category/router' 
import product from './api/v1/controller/product/router'
import user from './api/v1/controller/user/router'
import slots from './api/v1/controller/slotBooking/router'
import express from "express"
const app=express();

app.use('/api/v1/admin',admin);
app.use('/api/v1/vendor',vendor);
app.use('/api/v1/shop',restaurant);
app.use('/api/v1/category',category);
app.use('/api/v1/product',product);
app.use('/api/v1/user',user);
app.use('/api/v1/slot',slots);
export default app;

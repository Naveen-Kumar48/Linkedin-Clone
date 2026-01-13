import { Router } from "express";
import { login, register } from "../controllers/user.controller.js";
const router = Router();


router.route('/register').post(register)
router.route('/login').post(login) // TODO: add login controller
export default router;
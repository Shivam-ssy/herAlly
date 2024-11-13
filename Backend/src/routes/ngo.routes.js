import { Router } from "express";
import { listConnectedUser, listNgos, loginNgo, registerNgo } from "../controllers/Ngo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router =Router()

router.route("/register").post( registerNgo)
router.route("/login").post(loginNgo)
router.route("/ngo").get( listNgos)
router.route("/ngo/users").get(verifyJWT, listConnectedUser)


export default router;


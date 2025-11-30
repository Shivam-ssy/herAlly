import { Router } from "express";
import { getNgoById, listConnectedUser, listNgos } from "../controllers/Ngo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/verifyRole.middleware.js";


const router =Router()
router.route("/ngo/get-ngo-users").get(verifyJWT, listConnectedUser)
router.route("/ngo").get(verifyJWT,verifyRole(["admin","user"]),listNgos)
router.route("/ngo/:id").get(verifyJWT,verifyRole(["admin","user"]),getNgoById)


export default router;


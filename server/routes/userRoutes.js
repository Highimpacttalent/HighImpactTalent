import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getUser, updateUser,register, signIn,deleteUser,uploadResume,getUsers, toggleJobLike, updateProfileUrl, changePassword, updateSkills, updateUserDetails, updateWorkDetails, updateLinkedIn, uploadResumeMiddleware, uploadimageMiddleware, uploadImage } from "../controllers/userController.js";
import { uploadAuth } from "../middlewares/uploadAuth.js";

const router = express.Router();

//register user
router.post("/register", register);

// login user
router.post("/login", signIn);

// GET user
router.get("/get", userAuth, getUser);

router.get("/users",getUsers)

// UPDATE USER || PUT
router.put("/update-user", userAuth, updateUser);

router.post("/change-password",changePassword)

router.delete("/delete",userAuth,deleteUser);

router.post("/upload-resume",uploadAuth,uploadResumeMiddleware,uploadResume)
router.post("/upload-image",uploadAuth,uploadimageMiddleware,uploadImage)
router.post('/togglelike',userAuth,toggleJobLike)

router.post('/updateprofileurl',userAuth,updateProfileUrl)

router.post('/updateSkills', updateSkills)

router.post('/updateUserPersonnel', updateUserDetails)

router.post('/updateWork', updateWorkDetails)

router.put('/updateLinkdIn', updateLinkedIn)


// user/updateprofileurl
export default router;
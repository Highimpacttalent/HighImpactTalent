import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getUser, updateUser,register, signIn,deleteUser,uploadResume,getUsers, toggleJobLike, updateExperienceHistory, updateProfileUrl, changePassword, updateSkills, updateUserDetails, updateWorkDetails, updateLinkedIn, uploadResumeMiddleware, uploadimageMiddleware, uploadImage, uploadCompanyLogo, updateAbout, updateJobPreferences, checkEmail } from "../controllers/userController.js";
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
router.post("/upload-company-logo",uploadimageMiddleware,uploadCompanyLogo)
router.post('/togglelike',userAuth,toggleJobLike)

router.post('/updateprofileurl',userAuth,updateProfileUrl)

router.post('/updateSkills', updateSkills)

router.post('/updateUserPersonnel', updateUserDetails)

router.post('/updateWork', updateWorkDetails)

router.put('/updateLinkdIn', updateLinkedIn)

router.post('/update-exp', updateExperienceHistory)

router.post('/updateAbout', updateAbout)

router.post('/updateJobPreferences', updateJobPreferences)

router.post('/check-email', checkEmail)
// user/updateprofileurl
export default router;
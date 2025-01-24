import JWT from "jsonwebtoken";
const userAuth = async (req, res, next) => {
  const authHeader = req?.headers?.authorization;
  // console.log('success')
  // if (!authHeader || !authHeader?.startsWith("Bearer")) {
  //   next("Authentication == failed");
  // }

  const token = authHeader?.split(" ")[1];
  // console.log(token)
  if(!token){
    return res.json({
      success:false,
      msg:"Token is missing"
    })
  }
  // console.log(token)
  try {
    const userToken = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.body.user = {
      userId: userToken.userId,
    };
    next();
  } catch (error) {
    console.log(error);
    next("Authentication failed");
  }
};
export default userAuth;    
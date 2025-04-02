
const jwt =require('jsonwebtoken')
const User =require('../../models/userModel')



const checkUser= async (req,res,next)=>{
    const Auth=req.cookies.auth
    if(Auth){
        const decoded= await jwt.decode(Auth)
        const hisID=decoded.userId
        const loggedInUser= await User.findById(hisID)
        req.user=loggedInUser
        next()
    }else{
        res.render('login', {error: 'Please login to access dashboard'})
    }
}


module.exports=checkUser
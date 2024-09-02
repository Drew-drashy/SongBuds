// const jwt=require('jsonwebtoken');

// module.exports=function(req,res,next){
//     const token=req.header('x-auth-token');
//     if(!token){
//         return res.status(401).json({msg:'No token, Auth denied!'});

//     }
//     try{
//         const decoded=jwt.verify(token,process.JWT_SECRET);
//         req.user=decoded.user;
//         next();
//     }
//     catch(err){
//         res.status(401).json({msg:"Token is not valid"});
//     }
// }
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get the token from the Authorization header
    const authHeader = req.header('Authorization');
    
    // Check if there is no Authorization header or if it doesn't start with "Bearer"
    // console.log(authHeader,'authheader');                                                                                                               
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, Authorization denied!' });
    }

    // Extract the token from the "Bearer" scheme
    const token = authHeader.split(' ')[1];
    // console.log(token);
    if (!token) {
        return res.status(401).json({ msg: 'No token, Authorization denied!' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user from the token to the request object
        req.user = decoded.user;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

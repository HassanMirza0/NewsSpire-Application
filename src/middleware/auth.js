module.exports = (req, res, next) => {
    // Log the session to check if the session is being retrieved
    console.log("Session in middleware:", req.session); 

    if (!req.session || !req.session.user) {
        // If no session or user, redirect to login
        return res.redirect('/login');
    }
    // If logged in, proceed to the next middleware/route handler
    next();
};

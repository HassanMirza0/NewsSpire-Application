module.exports = (req, res, next) => {
    // Check if the user is logged in (i.e., if there is a session)
    if (!req.session.user) {
        // If not logged in, redirect to login page
        return res.redirect('/login');
    }
    // If logged in, proceed to the next middleware/route handler
    next();
};
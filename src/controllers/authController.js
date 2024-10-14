const User = require('../model/User')
const bcrypt = require('bcryptjs')
// Render homepage
// Render homepage
exports.getHomepage = (req, res) => {
    const isLoggedIn = req.session && req.session.user ? true : false;
    console.log("isLoggedIn:", isLoggedIn);  // Debugging line
    res.render('index', { 
        isLoggedIn, });
}



// Render login page
exports.getLogin = (req, res) => {
    res.render('login')
}

// Handle login logic
exports.postLogin = async (req, res) => {
    const { userName, password } = req.body

    try {
        // Find user by username
              const user = await User.findOne({ userName }); // Ensure there's an index on `userName`
      

        if (user) {
            // Compare the provided password with the hashed password stored in the database
            const isMatch = await bcrypt.compare(password, user.password)

         
            if (isMatch) {
                // If login is successful, redirect to your news page
                req.session.user = user;
                 // Redirect to the originally requested page or homepage
                 const redirectTo = req.session.redirectTo || '/'; // Default to home if no saved URL
                 delete req.session.redirectTo; // Clear the redirect URL after use
                 return res.redirect(redirectTo);
                
                // Redirect to homepage with query parameters after successful login
            return res.redirect('/');
               


            } else {
                // If password is incorrect, redirect to login page
                return res.render('login', { errorMessage: 'Invalid username or password.' });
            }
        } else {
            // If user not found, return error message on login page
            return res.render('login', { errorMessage: 'Invalid username or password.' });
        }

    } catch (error) {
        console.log("Error logging in:", error)
        res.status(500).send('Error logging in')
    }
}

// Render register page
exports.getRegister = (req, res) => {
    res.render('register')
}

// Handle registration logic
exports.postRegister = async (req, res) => {
    const { firstName, lastName, userName, gender, email, password, confirmPassword } = req.body

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match')
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user object
    const newUser = new User({
        firstName,
        lastName,
        userName, // Ensure consistency (use userName or username everywhere)
        gender,
        email,
        password: hashedPassword
    })

    try {
        // Save user to the database
        await newUser.save()
        console.log("User saved successfully")
        res.redirect('/login') // Redirect to login page after successful registration

    } catch (error) {
        console.log("Error saving user:", error)
        res.status(500).send("Error saving user")
    }
}
// Handle logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
        }
        res.redirect('/'); // Redirect to homepage after destroying session
    });
};

exports.getForgotPassword = (req, res) => {
    res.render('forgot-password'); // Render forgot password form view
};
exports.postForgotPassword = async (req, res) => {
    const { userName, email } = req.body;
    console.log("frogot",userName, email)

    try {
        const user = await User.findOne({ userName, email });

        // Check if user exists
        if (!user) {
            return res.render('forgot-password', { errorMessage: 'Invalid username or email.' });
        } 

        // Redirect to reset password page with username
        res.render('reset-password', { userName });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error'); // Handle server errors
    }
};

exports.getResetPassword = (req, res) => {
    const { userName } = req.query; // Get username from query parameter
    res.render('reset-password',{userName}); // Render reset password form view
};

exports.postResetPassword = async (req, res) => {
    const { userName, newPassword, confirmPassword } = req.body;
    console.log("post password",userName,newPassword,confirmPassword);



    // Check if passwords match
    if (newPassword !== confirmPassword) {
        return res.render('reset-password', { userName, errorMessage: 'Passwords do not match'})

    }

    try {
        const user = await User.findOne({ userName });

        // Check if user exists
        if (!user) {
            return res.render('reset-password', { userName, errorMessage: 'Invalid username.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(hashedPassword)
        user.password = hashedPassword; // Update user's password
        await user.save(); // Save user changes


        req.session.user = user;
        return res.redirect('/');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server error'); // Handle server errors
    }
};

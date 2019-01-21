const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

  signUp(req, res, next){
    res.render("users/sign_up");
},
  create(req, res, next){

    let newUser = {
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.password_conf
    };

    userQueries.createUser(newUser, (err, user) => {
        if(err){
            req.flash("error", err);
            res.redirect("/users/signup");
        } else {
            passport.authenticate("local")(req, res, () => {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
            })
        }
    });
    let msg = {
        to: newUser.email,
        from: 'test@example.com',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg)
    .catch((err) => {
        console.log(err)
    })
},
  signInForm(req, res, next){
res.render("users/sign_in");
},
  signIn(req, res, next){
    passport.authenticate("local")(req, res, function () {
    if(!req.user){
      req.flash("notice", "Sign in failed. Please try again.")
      res.redirect("users/sign_in");
    } else {
      req.flash("notice", "You've successfully signed in!");
      res.redirect("/");
    }
    })
  },
  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
}
}

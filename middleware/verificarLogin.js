const verificarLogin = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login.html");
    }
};
export default verificarLogin;

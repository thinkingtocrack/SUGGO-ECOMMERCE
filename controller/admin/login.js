const admin_login = (req, res) => {
    try {
        if (req.session.err) {
            delete req.session.err
            res.render('admin/admin_login', { error: true })
        } else {
            res.render('admin/admin_login')
        }
    } catch (error) {
        res.send(error)
    }
}

module.exports={admin_login}
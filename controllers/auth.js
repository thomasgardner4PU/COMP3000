exports.register = (req, res) => {
    console.log(req.body) // grabbing the data we send from the form and show in terminal
    res.send("Form submitted")
}
const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const morgan = require("morgan")

app.use(express.urlencoded({
    extended: true,
    limit: "5mb"
}))

app.use(morgan("tiny"))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/", (req, res) => {
    const { title, content } = req.body
    
    const header = Buffer.from(fs.readFileSync(path.join(__dirname, "/views/content/header.txt")), "hex").toString()
    const footer = Buffer.from(fs.readFileSync(path.join(__dirname, "/views/content/footer.txt")), "hex").toString()

    const data = header + content + footer

    fs.writeFileSync(path.join(__dirname, `/views/content/posts/${title.replace(" ", "-")}.ejs`), data)

    res.redirect("/")
})

app.get("/content/posts/:slug", (req, res) => {
    const { slug = null } = req.params

    if (slug) {
        res.render(`content/posts/${slug}`, {
            title: slug.replace("-", " ")
        })
    } else {
        res.send("masukin id konten")
    }
})

app.listen(3000)
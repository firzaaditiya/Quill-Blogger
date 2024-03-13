const express = require("express")
const app = express()
const path = require("path")
const fs = require("fs")
const morgan = require("morgan")
const slugify = require("slugify")

app.use(express.urlencoded({
    extended: true,
    limit: "5mb"
}))

app.use(morgan("tiny"))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/", (req, res) => {
    const { title, content } = req.body
    const header = Buffer.from(fs.readFileSync(path.join(__dirname, "/views/content/header.txt")), "hex").toString()
    const footer = Buffer.from(fs.readFileSync(path.join(__dirname, "/views/content/footer.txt")), "hex").toString()

    const data = header + `<h1>${title}</h1>` + content + footer
    const slugifiedTitle = slugify(title, { lower: true, replacement: '-', remove: /[*+~.()'"!?:@]/g });

    fs.writeFileSync(path.join(__dirname, `/views/content/posts/${slugifiedTitle}.ejs`), data)

    res.redirect("/")
})

app.get("/content/posts/:slug", (req, res) => {
    const { slug = null } = req.params

    if (slug) {
        const filePath = path.join(__dirname, `/views/content/posts/${slug}.ejs`)
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if(err) {
                res.send('Konten tidak ditemukan')
            } else {
                const originalTitle = data.match(/<h1>(.*?)<\/h1>/)[1]
                res.render(`content/posts/${slug}`, { title: originalTitle, content: data });
            }
        })
    } else {
        res.send("masukin id konten")
    }
})

app.listen(3000)

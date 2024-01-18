const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const path = require('path');
const fs = require('fs'); // Add this line
const multer = require('multer'); // Add multer for handling file uploads

const app = express();
const port = 3000;

app.use(cors()); // Add this line
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Directory to save HTML blogs
const blogDirectory = path.join(__dirname, 'blogs');
const imagesDirectory = path.join(__dirname, 'blog-images');

// Ensure the 'blogs' directory exists
if (!fs.existsSync(blogDirectory)) {
    fs.mkdirSync(blogDirectory);
}
if (!fs.existsSync(imagesDirectory)) {
    fs.mkdirSync(imagesDirectory);
}

let maxblogs = 999;
let currentBlogsCount = 0;

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: imagesDirectory,
    filename: (req, file, callback) => {

        const fileName = `${currentBlogsCount}.jpg`;
        callback(null, fileName);
    },
});

const upload = multer({ storage: storage });


app.get('/blogs/:title', (req, res) => {
    const title = req.params.title;
    const filePath = path.join(blogDirectory, `${title}.html`);

    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        res.send(content);
    } else {
        res.status(404).send('Blog not found.');
    }
});

// Directory to store HTML blogs
const blogsDirectory = path.join(__dirname, 'blogs');



app.get('/blogs', (req, res) => {
    fs.readdir(blogsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading blogs directory:', err);
            res.status(500).send('Internal Server Error');
        } else {
            const htmlFiles = files.filter(file => path.extname(file) === '.html'); //to get html files

            const blogs = htmlFiles.map(file => {
                const filePath = path.join(blogsDirectory, file);
                const content = fs.readFileSync(filePath, 'utf8');
                return {
                    title: path.basename(file, '.html'),
                    content,
                    image: `/images/${path.basename(file, '.html')}.jpg`,
                    category: 'Uncategorized',
                };
            });

            res.json({ blogs });
        }
    });
});

// Handle image uploads for new blogs
app.post('/blogs', upload.single('image'), (req, res) => {

    const { title, category, content } = req.body;

    // Save data to an HTML file
    const filePath = path.join(blogDirectory, `${title}.html`);

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <link rel="stylesheet" href="/src/blog.css"/>
        </head>
        <body>
            <img src="blog-images/blog1.jpg" alt="">
            <h1 id="blog-title">${title}</h1>
            <h4 id="blog-category">${category}</h4>
            <p id="blog-content">${content}</p>
        </body>
        </html>
    `;

    fs.writeFile(filePath, htmlContent, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Blog saved successfully!');
            currentBlogsCount = currentBlogsCount + 1;
            
        }
        console.log(currentBlogsCount)
    });
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

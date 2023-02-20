/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Divyanshu Sharma____________________ Student ID: __169341211__________ Date: __19-02-2023____________
*
*  Online (Cyclic) Link: https://excited-crow-pullover.cyclic.app
********************************************************************************/
const express = require("express"); // obtaining expressjs
const path = require("path");
const blogService = require("./blog-service");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// create upload middleware
const upload = multer();

// config cloudinary file upload
cloudinary.config({

  cloud_name: 'dbx8rumqt',
  api_key: '524399159915694',
  api_secret: '7F5e4BWbaMKpvOWNv8kT458bR8E',
  secure: true

});
//check
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/about");
});
/**
 * Render default homepage
 */
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/about.html"));
});

app.get("/blog", (req, res) => {
  blogService
    .getPublishedPosts()
    .then((publishedPosts) => {
      res.json(publishedPosts);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/posts", (req, res) => {
  const category = req.query.category;
  const minDate = req.query.minDate;

  // get categories
  if (category) {
    blogService
      .getPostsByCategory(category)
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        res.send(err);
      });
  } else if (minDate) {
    // get by date
    blogService
      .getPostsByMinDate(minDate)
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    
    blogService
      .getAllPosts()
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/addPost.html"));
});
// save post
app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }

  function processPost(imageUrl) {
    req.body.featureImage = imageUrl;
    const postData = req.body;

    blogService
      .addPost(postData)
      .then((newPost) => {
        res.redirect("/posts");
      })
      .catch((err) => {
        res.send(err.message);
      });
  }
});


app.get("/post/:id", (req, res) => {
  blogService
    .getPostById(req.params.id)
    .then((post) => {
      res.json(post);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/categories", (req, res) => {
  blogService
    .getCategories()
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.use((req, res, next) => {
  res.status(404).send("Endpoint not found");
});

blogService
  .initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Express http server listening on ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

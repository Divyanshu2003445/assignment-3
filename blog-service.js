const Sequelize = require("sequelize");
const { gte } = Sequelize.Op;

// set up sequelize to point to our postgres database
var sequelize = new Sequelize('nebmobfr', 'nebmobfr', 'BYfpt5kSFaocbei4wQZ8gqVrs7L3V3OS', {
  host: 'ruby.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});


// Define a "Post" model
const Post = sequelize.define("Post", {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN,
});

// Define a "Category" model
const Category = sequelize.define("Category", {
  category: Sequelize.STRING,
});

// POST and Category Relationship
Post.belongsTo(Category, { foreignKey: "category" });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(function () {
        resolve();
      })
      .catch((err) => {
        reject("unable to sync the database");
      });
  });
};

module.exports.getAllPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { category: category } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostsByMinDate = function (minDateStr) {
  return new Promise((resolve, reject) => {
    Post.findAll({
      where: {
        postDate: { [gte]: new Date(minDateStr) },
      },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPostById = function (id) {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { id: id } })
      .then((data) => {
        resolve(data[0]);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.addPost = function (postData) {
  return new Promise((resolve, reject) => {
    // set published as boolean
    postData.published = postData.published ? true : false;

    // set "" to null
    for (const property in postData) {
      if (postData[property] === "") {
        postData[property] = null;
      }
    }

    // new date
    postData.postDate = new Date();

    // create post
    Post.create(postData)
      .then((newPost) => {
        resolve();
      })
      .catch((err) => {
        reject("unable to create post");
      });
  });
};

module.exports.getPublishedPosts = function () {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { published: true } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.getPublishedPostsByCategory = function (category) {
  return new Promise((resolve, reject) => {
    Post.findAll({ where: { published: true, category: category } })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.deletePostById = function (id) {
  return new Promise((resolve, reject) => {
    Post.destroy({ where: { id: id } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to delete post");
      });
  });
};

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
    Category.findAll()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject("no results returned");
      });
  });
};

module.exports.addCategory = function (categoryData) {
  return new Promise((resolve, reject) => {
    // set "" to null
    for (const property in categoryData) {
      if (categoryData[property] === "") {
        categoryData[property] = null;
      }
    }

    // create category
    Category.create(categoryData)
      .then((newCategory) => {
        resolve();
      })
      .catch((err) => {
        reject("unable to create category");
      });
  });
};

module.exports.deleteCategoryById = function (id) {
  return new Promise((resolve, reject) => {
    Category.destroy({ where: { id: id } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject("unable to delete category");
      });
  });
};

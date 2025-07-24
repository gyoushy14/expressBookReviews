const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register user
public_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists." });
  }

  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const response = await new Promise((resolve) => {
      resolve({ data: books });
    });
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const book = await new Promise((resolve) => {
      resolve(books[isbn]);
    });

    if (book) {
      return res.status(200).json(book);
    } else {
      return res
        .status(404)
        .json({ message: "Book not found for the given ISBN" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book", error });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const authorName = req.params.author.toLowerCase();

  try {
    const matchingBooks = await new Promise((resolve) => {
      const results = [];
      for (const [isbn, book] of Object.entries(books)) {
        if (book.author.toLowerCase() === authorName) {
          results.push({ isbn, ...book });
        }
      }
      resolve(results);
    });

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res
        .status(404)
        .json({ message: "No books found for the given author" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error searching by author", error });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const titleParam = req.params.title.toLowerCase();

  try {
    const matchingBooks = await new Promise((resolve) => {
      const results = [];
      for (const [isbn, book] of Object.entries(books)) {
        if (book.title.toLowerCase() === titleParam) {
          results.push({ isbn, ...book });
        }
      }
      resolve(results);
    });

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res
        .status(404)
        .json({ message: "No books found for the given title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error searching by title", error });
  }
});

// Get book review
public_users.get("/review/:isbn", async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const reviews = await new Promise((resolve) => {
      const book = books[isbn];
      resolve(book ? book.reviews : null);
    });

    if (reviews) {
      return res.status(200).json(reviews);
    } else {
      return res
        .status(404)
        .json({ message: "Book not found for the given ISBN" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving review", error });
  }
});

const axios = require("axios");

// Get books based on author using async/await with Axios
public_users.get("/axios/author/:author", async (req, res) => {
  const author = req.params.author.toLowerCase();

  try {
    const response = await axios.get("http://localhost:5000/");

    const books = response.data;
    const matchingBooks = [];

    for (const [isbn, book] of Object.entries(books)) {
      if (book.author.toLowerCase() === author) {
        matchingBooks.push({ isbn, ...book });
      }
    }

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res
        .status(404)
        .json({ message: "No books found for the given author" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching books", error: error.message });
  }
});



const axios = require("axios");

// Get books based on title using async/await and Axios
public_users.get("/axios/title/:title", async (req, res) => {
  const titleParam = req.params.title.toLowerCase();

  try {
    const response = await axios.get("http://localhost:5000/");

    const books = response.data;
    const matchingBooks = [];

    for (const [isbn, book] of Object.entries(books)) {
      if (book.title.toLowerCase() === titleParam) {
        matchingBooks.push({ isbn, ...book });
      }
    }

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res
        .status(404)
        .json({ message: "No books found for the given title" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books",
      error: error.message,
    });
  }
});


module.exports.general = public_users;

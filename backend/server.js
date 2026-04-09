const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('bugs.db')

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS bugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    fix TEXT,
    date TEXT
  )
`)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// CRUD operations implemented
// CREATE
app.post('/bugs', (req, res) => {
  const { title, description, fix, date } = req.body

  if (!title) {
    return res.status(400).json({ error: "Title is required" })
  }

  db.run(
    `INSERT INTO bugs (title, description, fix, date) VALUES (?, ?, ?, ?)`,
    [title, description, fix, date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ id: this.lastID })
    }
  )
})

// READ
app.get('/bugs', (req, res) => {
  db.all(`SELECT * FROM bugs`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    res.json(rows)
  })
})

// UPDATE
app.put('/bugs/:id', (req, res) => {
  const { id } = req.params
  const { title, description, fix, date } = req.body

  db.run(
    `UPDATE bugs SET title=?, description=?, fix=?, date=? WHERE id=?`,
    [title, description, fix, date, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ message: "Bug updated" })
    }
  )
})

// DELETE
app.delete('/bugs/:id', (req, res) => {
  const { id } = req.params

  db.run(
    `DELETE FROM bugs WHERE id=?`,
    [id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.json({ message: "Bug deleted" })
    }
  )
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
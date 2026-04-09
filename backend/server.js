const express = require('express')
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose()

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database('bugs.db')

// Create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS bugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    fix TEXT,
    date TEXT
  )
`).run()

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

  const stmt = db.prepare(`
    INSERT INTO bugs (title, description, fix, date)
    VALUES (?, ?, ?, ?)
  `)

  const result = stmt.run(title, description, fix, date)
  res.json({ id: result.lastInsertRowid })
})

// READ
app.get('/bugs', (req, res) => {
  const bugs = db.prepare(`SELECT * FROM bugs`).all()
  res.json(bugs)
})

// UPDATE
app.put('/bugs/:id', (req, res) => {
  const { id } = req.params
  const { title, description, fix, date } = req.body

  db.prepare(`
    UPDATE bugs
    SET title=?, description=?, fix=?, date=?
    WHERE id=?
  `).run(title, description, fix, date, id)

  res.json({ message: "Bug updated" })
})

// DELETE
app.delete('/bugs/:id', (req, res) => {
  const { id } = req.params

  db.prepare(`DELETE FROM bugs WHERE id=?`).run(id)

  res.json({ message: "Bug deleted" })
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
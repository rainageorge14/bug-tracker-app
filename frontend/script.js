const BACKEND_URL = "http://localhost:3000"


async function addBug() {
  const title = document.getElementById('title').value
  const description = document.getElementById('description').value
  const fix = document.getElementById('fix').value
  const date = document.getElementById('date').value

  await fetch(`${BACKEND_URL}/bugs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, fix, date })
  })

  loadBugs()
}

async function loadBugs() {
  const res = await fetch(`${BACKEND_URL}/bugs`)
  const data = await res.json()

  const list = document.getElementById('bugList')
  list.innerHTML = ""

  data.forEach(bug => {
    const li = document.createElement('li')

    li.innerHTML = `
      <b>${bug.title}</b> - ${bug.description} 
      <br>Fix: ${bug.fix} 
      <br>Date: ${bug.date}
      <br>
      <button onclick="deleteBug(${bug.id})">Delete</button>
      <button onclick="updateBug(${bug.id})">Edit</button>
      <hr>
    `

    list.appendChild(li)
  })
}

async function deleteBug(id) {
  await fetch(`${BACKEND_URL}/bugs/${id}`, {
    method: "DELETE"
  })
  loadBugs()
}

async function updateBug(id) {
  const newTitle = prompt("Enter new title:")
  const newDesc = prompt("Enter new description:")
  const newFix = prompt("Enter new fix:")
  const newDate = prompt("Enter new date:")

  await fetch(`${BACKEND_URL}/bugs/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: newTitle,
      description: newDesc,
      fix: newFix,
      date: newDate
    })
  })

  loadBugs()
}

// Load on start
loadBugs()
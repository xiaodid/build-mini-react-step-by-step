const express = require('express')

const port = 10001
const app = express()
app.use(express.static('.'))

app.post('/test.test.test', (req, res) => {
  res.json({
    responseCode: 'user.invalid',
  })
})

app.listen(port)
console.log(`test server started on ${port}...`)

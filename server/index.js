const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()
app.use(cors())

// 解析  特别是 application/x-www-form-urlencoded
// extended 为 true 使用 qs 库解析参数，比 querystring 更加强大
// extended 为 false 使用 querystring 库解析参数
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
app.use(bodyParser.text())

app.post('/reportData', (req, res) => {
    console.log(req.body)
    res.status(200).send('ok')
})

app.listen(9800, () => {
    console.log('server is running on port 9800')
})
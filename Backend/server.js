const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") })
const app = require("./src/app")
const connectToDB = require("./src/config/database")

connectToDB()

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
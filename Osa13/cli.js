require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {logging: false})


const main = async () => {
  try {
    await sequelize.authenticate()
    const notes = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    sequelize.close()
    for (i in notes) {
        console.log(notes[i].author+": '" + notes[i].title+"', " + notes[i].likes + " likes")
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
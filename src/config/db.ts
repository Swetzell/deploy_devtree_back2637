import mongoose from "mongoose";

console.log(process.env.MONGO_URI)
export const connectDB = async () => {
  //colocamos un try catch por si nos equivocamos al colocar datos
  try {
    //const url = ''
    const { connection } = await mongoose.connect(process.env.MONGO_URI)
    //console.log(connection)
    //console.log('MongoDB conectado')
    const url = '${connection.host}:${connection.port}'
  } catch (error) {
    console.log(error.message)
    process.exit(1) //termina el proceso de node
  }
}

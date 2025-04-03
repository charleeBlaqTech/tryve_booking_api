const mongoose = require('mongoose');

const db_connection = async ()=>{
    try {
        process.env.ENVIRONMENT !== 'development' ?

        await mongoose.connect(process.env.MONGO_URI)
        :
        await mongoose.connect(process.env.MONGO_URI_LOCAL)
        console.log('MongoDB connected successfully....')
    } catch (error) {
        console.error(error.message || 'MongoDb connection Error')
        process.exit(1)
    }
}

module.exports = db_connection
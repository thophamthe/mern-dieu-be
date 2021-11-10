
const Mongo = require('mongoose');
async function connect(){
    try {
        await  Mongo.connect( process.env.DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connected')
    } catch (error) {
        console.log(error);
    }
}
module.exports={connect};
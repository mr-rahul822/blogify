const mongoose = require("mongoose")

async function main(){
    await mongoose.connect("mongodb+srv://darkDevil9:Hunter%409Bhai@darkbhai.ctymelt.mongodb.net/Blogify")
}

module.exports = main;
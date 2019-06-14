const Express = require("express");
const Mongoose = require("mongoose");
const BodyParser = require("body-parser");

var app = Express();

Mongoose.connect("mongodb://zypher:subhahu123@ds337377.mlab.com:37377/user") ;

var userSchema = new Mongoose.Schema({
    name: String,
    email: String,
    phone_number: String,
    designation: String,
    address: String,
    comment: { type: [{
        id: String,
        message: String
    }] },
    interests: { type: [String], required: true }
});

const userModel = Mongoose.model("person", userSchema);

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.post("/person", async (request, response) => {
    try {
        var person = new userModel(request.body);
        var dd = request.body ;
        var result = await person.save();
        console.log('Adding person: ' + JSON.stringify(dd));
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/people", async (request, response) => {
    try {
        var result = await userModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/person/:id", async (request, response) => {
    try {
        var person = await userModel.findById(request.params.id).exec();
        response.send(person);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.put("/person/:id", async (request, response) => {
    try {
        var person = await userModel.findById(request.params.id).exec();
        person.set(request.body);
        var result = await person.save();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.delete("/person/:id", async (request, response) => {
    try {
        var result = await userModel.deleteOne({ _id: request.params.id }).exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});




app.listen( process.env.PORT || 8080, () => {
    console.log("Listening at :8080...");
});


// mongodb://"zypher":"subhahu123"@ds337377.mlab.com:37377/user
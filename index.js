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

app.post("/user", async (request, response) => {
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
app.get("/users", async (request, response) => {
    try {
        var result = await userModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/user/:id", async (request, response) => {
    try {
        var person = await userModel.findById(request.params.id).exec();
        response.send(person);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/comments/:id", async (request, response) => {
    try {
        var person = await userModel.findById(request.params.id).exec();
        response.send(person.comment);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.get("/user/interests/:interest", async (request, response) => {
    try {
        var person = await userModel.find( { interests: request.params.interest  }).exec();
        console.log(request.params.interest)
        console.log(person) ;
        response.send(person);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/userupdate/comments/:id", async (request, response) => {
    try {
        console.log(request.body.comment)
        var person = await userModel.findByIdAndUpdate(request.params.id, { $push: { comment: request.body.comment[0] } } ).exec();
        var result = await person.save(done);
        console.log(request.body);
        console.log(result) ;
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/user/edit/:id", async (request, response) => {
    try {
        console.log(request.body.comment)
        var person = await userModel.findByIdAndUpdate(request.params.id, { $set: request.body } ).exec();
        var result = await person.save(done);
        console.log(request.body);
        console.log(result) ;
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.delete("/user/:id", async (request, response) => {
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
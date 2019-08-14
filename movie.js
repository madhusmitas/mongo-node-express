var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('moviedb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'moviedb' database");
        db.collection('movie', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'movie' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving movie: ' + id);
    db.collection('movie', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('movie', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addmovie = function(req, res) {
    var movie = req.body;
    console.log('Adding movie: ' + JSON.stringify(movie));
    db.collection('movie', function(err, collection) {
        collection.insert(movie, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updatemovie = function(req, res) {
    var id = req.params.id;
    var movie = req.body;
    console.log('Updating movie: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('movie', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, movie, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating movie: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(movie);
            }
        });
    });
}

exports.deletemovie = function(req, res) {
    var id = req.params.id;
    console.log('Deleting movie: ' + id);
    db.collection('movie', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var movie = [
    {
        name: "Harry Potter and the Order of the Phoenix",
       img:"https://bit.ly/2IcnSwz",
       summary: "Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry."
    },
    {
        name: "The Lord of the Rings: The Fellowship of the Ring",
        img: "https://bit.ly/2tC1Lcg",
	summary: "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed."
    },
    {
        name: "Avengers: Endgame",
	img: "https://bit.ly/2Pzczlb",
	summary: "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle. Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America and Bruce Banner -- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos -- the evil demigod who decimated the planet and the universe."
   
    }];

    db.collection('movie', function(err, collection) {
        collection.insert(movie, {safe:true}, function(err, result) {});
    });

};
var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
var session = require("express-session");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
	secret: "aSdFgHjKlÑ13579",
	resave: false,
	saveUninitialized: false
}));

app.set("view engine", "jade");

app.get("/",function(req,res){
	res.render("index");
	if (req.session.user) {
		console.log(req.session.user._id, req.session.user.name);		
	}
});


app.get("/login",function(req,res){
	var vars = {};

	if (req.session.user) {
		res.redirect("dashboard");
	}

	// console.log('get',req.query);
	if (req.query.feedback != 'undefined') {
		vars = req.query;
	}

	User.find(function(err,doc){
		console.log(doc);		
	});
	//console.log('req',req.originalUrl, typeof req.originalUrl);
	/*if (req.param("type")) {
		vars.type = req.param("type"),
		vars.feedback= req.param("feedback")
	}*/
	res.render("login", vars);
});

app.get("/singup",function(req,res){
	res.render("singup");
});

app.post("/users",function(req,res){
	
	var user = new User({
	
		email: req.body.email, 
		password: req.body.password,
		password_confirmation: req.body.password_confirmation
	});

	console.log(user.password_confirmation);

	user.save().then(function(us){
		//res.send("Guardamos los datos del usuario");
		res.redirect("login?type=success&feedback=Guardamos los datos del usuario");
	},function(err){
		if (err) {
			console.log(String(err));
		}
		var feedbackMsg = "No pudimos guadar los datos del usuario";
		//res.send(feedbackMsg);
		//res.status(500).json({ feedback: feedbackMsg });
		res.render("users",{type:"warning",feedback: feedbackMsg});
		//res.redirect("login");
		setTimeout(function(){ res.redirect("singup"); }, 2000);

	});

});

app.post("/sessions",function(req,res){
	
	User.findOne({email:req.body.email,password:req.body.password},function(err,user){
		if (user) {
			res.json(user);
			console.log(user);
			// req.session.user._id = user._id;
			// req.session.user.name = user.name;
			req.session.user = user;
			//res.send("Usuarios rescatados");
			res.redirect("dashboard?type=success&feedback=Ingreso correcto.");
		}else{
			//res.send("No existe el usuario");
			res.redirect("login?type=danger&feedback=Usuarios no existe.");
		}
	});
});

app.get("/dashboard",function(req,res){
	if(req.session.user){
	let vars = {name: req.session.user.name};

	if (req.query.feedback != 'undefined') {
		vars.feedback = req.query.feedback;
		vars.type = req.query.type;
	}

	if (req.session.user) {
		res.render("dashboard", vars);
	}else{
		res.redirect("login");
	}
	console.log('sesion',req.session);
	}else{

		res.redirect("login");
	}
});

app.get("/log1n",function(req,res){
		User.find(function(err,jj)
{
	if(err){
		res.send(err);
	}else{
		res.json(jj)
	}
}

		);


		
		
		

});

app.get("/log_out",function(req,res){
	req.session.destroy(function(err){

	 	if(!err){
		res.redirect("/login");
			console.log("deberia renderizar login");
		 }else{
		//res.redirect("/log_in");

		 }

 });
 

});
app.listen(8080);
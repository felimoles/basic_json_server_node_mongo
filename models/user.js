var mongoose = require("mongoose");
var Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/app_forestal");

var password_validation = {
			validator: function(p){
				this.password_confirmation == p;
			},
			message: "Las contraseñas no son iguales"
		}

var email_match = [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/, "Coloca un email válido"];

var user_schema = Schema({

	password: {
		type:String,
		minlength:[3,"La contraseña es muy corta"],
		validate: password_validation
	},
	email: {type:String,required:"El correo es obligatorio",match:email_match},


});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c = password;
});

var User = mongoose.model("User", user_schema);

module.exports.User = User;
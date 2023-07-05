import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  scores: {type: Map, of: Number, default: {}},
  opsys: {type: String, default: "Mac"},
  mode: {type: String, default: "Desktop"}
});

userSchema.pre("save", async function (next) {
	this.email = this.email.toLowerCase();
	if (this.isNew || this.isModified("password")) {
		const saltRounds = 10;
		this.password = await bcrypt.hash(this.password, saltRounds);
	}
	next();
});

userSchema.methods.isCorrectPassword = async function (password) {
	console.log(this.password);
	console.log(password);
	return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

export default User;
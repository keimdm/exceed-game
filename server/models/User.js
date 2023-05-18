import pkg from 'mongoose';
const { Schema, model } = pkg;

// defines user schema
const userSchema = new Schema(
    {
      username: { type: String, required: true, unique: true, trim: true },
      // validates email format
      email: { type: String, required: true, unique: true, trim: true, match: /.+\@.+\..+/, },
      // defines list of thought and friend IDs linked to relevant objects
    },
    {
      toJSON: {
        virtuals: true,
      }
    }
  );
  
  const User = model('user', userSchema);
  
  export default User;
  
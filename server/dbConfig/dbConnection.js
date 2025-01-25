import mongoose from "mongoose";
const dbConnection = async () => {
    try {
        // const dbConnection = await mongoose.connect(process.env.MONGODB_URL);
         const dbConnection = await mongoose.connect('mongodb+srv://developerhighimpact:j5dnAEhz8FZibFrb@cluster0.yjt2q.mongodb.net/jobportal?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, useUnifiedTopology: true });

        console.log("Database Connected");
    } catch (error) {
        console.log("DB Error" + error);
    }
}
export default dbConnection;


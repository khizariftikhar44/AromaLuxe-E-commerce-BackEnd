
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

// connection step - 1

mongoose.connect("mongodb://localhost:27017/ministore")
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch((error) => {
        console.log(error)
    });


// Create Schema step - 2
const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,         
        },
        email: {
            type: String,                      
        },
        password: {
           type: String,           
        }
    },
    {
        timestamps : true
    }
)

// Create Model step - 3
const User = mongoose.model("User", userSchema)



//ROUTES
// POST API step - 4

app.post("/register", async (req, res) => {
  try {
    console.log(req.body);

    const user = await User.create(req.body);

    res.json({
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});


app.post("/login", async (req, res) => {
  try {
    
    const {email, password} = req.body

    const user = await User.findOne({
        email: email
    });

    if(!user){
        return res.status(404).json({
            message : "User not found"
        })
    }

    if(user.password !== password){
        return res.status(401).json({
            message: "Incorrect Password"
        })
    }


    res.json({
      message: "Login Successfully",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});








app.listen(3000, () => {
    console.log("Server is Running");

})
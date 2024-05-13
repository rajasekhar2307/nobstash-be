const express = require("express");
const cors=require("cors");
const bcrypt = require('bcryptjs');
const jwt=require("jsonwebtoken");
const mongoose=require("mongoose");
const cookieSession=require("cookie-session");
const cookieparser=require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const MONGODB_URI="mongodb+srv://shivatalluri725:Shiva551@cluster0.xtiys65.mongodb.net/Auctionblog";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
/*app.use(cors({
  origin: 'http://localhost:3000', // Your frontend's origin
  methods:["get","post"],
  credentials: true, // Allow credentials (cookies)
}));*/
app.use(cors());
app.use(cookieparser());
// app.use(
//   cookieSession({
//     name: 'session',
//     keys: ['your-secret-key'],
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   })
// );
const bidSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  bidAmount: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  auctionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auction',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userLocation: {
    type: String
  },
});
 const userSchema = new mongoose.Schema({
        userName: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            min: 10000000,
            default: 9876543210,
            required: true
        },
        amount:{
            type:Number,
            default:6000,
            require:true,
        }
    }, { timestamps: true });


 const auctionSchema = new mongoose.Schema({
    AuctionID: {
      type: String,
      required: true,
      unique:true
    },
    Aval: {
      type: Number,
      required: true
    },
    Title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageURL: {
      type: String,
      required: true
    },
    videoURL:{
      type: String,
      default:"https://www.youtube.com/watch?v=t_E5zjFj6Ew",
      required: true
    },
    poc_email: {
      type: String,
      required: true
    },
    poc_name: {
      type: String,
      required: true
    },
    reserved_price: {
      type: Number,
      required: true
    },
    time: {
      type: Date,
      required: true
    },
    endtime: {
      type: Date,
      default: function() {
        const oneHourLater = new Date(this.time);
        oneHourLater.setHours(oneHourLater.getHours() + 1);
        return oneHourLater;
      }
    }
  });
const Auction = mongoose.model('Auction', auctionSchema);

const user=mongoose.model("User",userSchema);
const bids=mongoose.model("Bid",bidSchema);

app.get("/",function(req,res){
    res.send("hello world");
});
app.post("/api/auth/signup",async (req,res,next)=>{
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.Password, salt);
        const newUser={
            userName:req.body.UserName,email:req.body.email,password:hash
        }
        user.insertMany([newUser]).then(()=>{res.status(200).send({userName:req.body.UserName,email:req.body.email});}).catch((e)=>{console.log(e)});
    } catch (err) {
        res.send(err);
    }
})
app.post("/api/auth/login",async (req,res,next)=>{
    try {
        console.log(req.body);
        const users = await user.findOne({ 
            userName:req.body.UserName });
        if (!users) {
            res.send("user Not found");
        }
        const isCorrect = await bcrypt.compare(req.body.Password, users.password);
        if (!isCorrect) {
            res.send("Incorrect password");
        }
        const token = jwt.sign({ id: user._id }, "shiva$rama$krishna");
        const { password, ...otherDetails } = users._doc;
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json(otherDetails);
    } catch (err) {
         console.log("error"+err);
         res.status(500);
    }
})
app.post("/api/auctions",async(req,res)=>{
  try {
  const date = new Date(req.body.selectedDate);
  const temp=req.body.selectedTime;
  const [hours, minutes] = temp.split(":").map(part => parseInt(part, 10));
  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(0);
    const newAuction={
      AuctionID:req.body.auctionID,
      Aval:req.body.Quantity,
      Title: req.body.title,
      description:req.body.Description,
      imageURL:req.body.imgUrl ,
      videoURL:req.body.videoUrl,
      poc_email:req.body.pocemail,
      poc_name: req.body.pocname,
      reserved_price: req.body.reserve,
      time:date,
    }
    Auction.insertMany([newAuction]).then(()=>{res.status(200).send("successfully generated");}).catch((e)=>{console.log(e)});
  
  } catch (err) {
    res.send(err);
   }
})
app.get("/api/getauctions",async(req,res)=>{
  const currentDateTime = new Date();
  Auction.find({ time: { $gte: currentDateTime }}).then((results)=>{res.status(200).send(results)}).catch((e)=>{res.status(500);console.log(e);});
})
app.get('/api/getauction/:id',async (req, res) => {
  const id = req.params.id;
  Auction.find({_id:id}).then((results)=>{res.status(200).send(results)}).catch((e)=>{res.status(500);console.log(e);});
});
app.get('/api/getbids/:id',async(req,res)=>{
  const id = req.params.id;
  bids.find({ AuctionID: id }).sort({ time: 1 }).then((results) => {
    res.status(200).send(results);
}).catch((e) => {
    res.status(500);
    console.log(e);
});
})
app.listen(8000, function(){
    console.log("Server started on port 8000");
  });
const express = require ('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000;

app.use(express.json());

const secretKey = 'mykey';

const users = [
    {
        user_id: 1, 
        username: "Fiza",  
        password:"123" , 
        role: "admin",
        email: "Fiza@gmail.com",
        },
    {
        user_id: 2, 
        username: "user1", 
        password:"456",  
        email: "user1@gmail.com",
        role: "user",
        },
    {
        user_id: 3, 
        username: "user2", 
        password:"789", 
        email: "user2@gmail.com", 
        role: "user",
       },
    {
        user_id: 4, 
        username: "user3", 
        password:"1011", 
        email: "user3@gmail.com",
        role: "user",
       },
    {
        user_id: 5, 
        username: "user4", 
        password:"1213", 
        email: "user4@gmail.com",
        role: "user",
        },
    {
        user_id: 6, 
        username: "user5", 
        password:"1415", 
        email: "user5@gmail.com",
        role: "user",
        },
]

//GET all login user data

app.get('/users',function(req, res){
   return res.status(200).json(users);
})

// POST login userdata
app.post('/login',(req, res)=>{
    const {username , password} = req.body; 

    const loginuser = users.find(loginuser => loginuser.username === username && loginuser.password === password);
    
    if(loginuser){
        const token = jwt.sign({username: loginuser.username, role: loginuser.role}, secretKey,{expiresIn:'1h'});
      return  res.status(200).json({message: `User login Successfully. Welcome,${username}`,
        token
    });
    }
    else{
      return  res.status(401).send('Invalid username and password.');
    }
})

app.get('/isLoggedIn',authenticate,(req,res)=>{
    let user = req.user;
  return res.status(200).json({
    message:"Welcome",
    user
  })
  })
function authenticate(req,res,next){
    let token = req.headers.token;
    if(!token){
      return res.status(401).json({
        message:"Not logged In."
      })
    }
    jwt.verify(token, secretKey, function(err, decoded){
        if(err){
            return res.status(403).json({
                message: "Invalid token!"
            });
        }
        req.user = decoded;
        next();
    });
  
  }

app.get('/admin',authenticate,(req, res)=>{
   
    if(req.user.role !== 'admin'){
        return res.status(403).json({
            message: "Admin access required."
        })
    }
    else{
        res.json({message: "welcome Admin"})
    }
})

app.listen(port,()=>{
    console.log(`server run on http://localhost:${port}`);
})

const post = [{
    user_id: 1,
    username: "Fiza",
    post_content: "bxzjkcbnk",
    likes: []
},
{
    user_id: 2,
    username: "user1",
    post_content: "bxzjkcbnk",
    likes: []
},
{
    user_id: 3,
    username: "user2",
    post_content: "bxzjkcbnk",
    likes: []
},
{
    user_id: 4,
    username: "user3",
    post_content: "bxzjkcbnk",
    likes: []
},
{
    user_id: 5,
    username: "user4",
    post_content: "bxzjkcbnk",
    likes: []
},
{
    user_id: 6,
    username: "user5",
    post_content: "bxzjkcbnk",
    likes: []
},
]
app.get('/posts/other-user',authenticate,(req, res)=>{
    const loggeduser =req.user.username;

    const otheruserpost = post.filter(posts => posts.username !== loggeduser);
   return res.status(200).json(otheruserpost)

});

app.get('/myposts',authenticate,(req, res)=>{
    const loggeduser =req.user.username;

    const userpost = post.filter(posts => posts.username === loggeduser);
    if(!userpost){
      return  res.status(404).json({message: "No post show"})
    }
   return res.status(200).json({message: `${loggeduser} Posts`,
    userpost});

});

app.delete('/deleteposts/admin/:id',authenticate,(req, res)=>{
    const loggeduser =req.user.role === 'admin';
    if(!loggeduser){
      return  res.status(403).json({message: "You do not have permission to delete users Posts"})
    }
    const user_id =req.user.username;
    const otheruserpost = post.filter(posts => posts.user_id === user_id);
    if(!otheruserpost){
       return res.status(404).json({message: "No Posts found"})
    }
   return res.status(200).json({message: 'Delete User Post'})
});

app.delete('/deletemyposts/:username',authenticate,(req, res)=>{
    const {username} = req.params;
    const loggeduser =req.user.username;

    if(loggeduser !== username){
       return res.status(403).json({message: "You do not have permission to delete users Posts"})
    }
    
    return res.status(200).json({message: 'Delete your post'})
});
# memegenerator-backend
This Express Apps is the backend part of the Memegenerator Application.

To Setup it : <br/>
npm install

 and to configure :
 export a Key.js file from config folder like this: <br/>
 <pre>
 <code>
 module.exports={
     google:{
         clientId:"xxxxxxxxxxxxxxxxxxxx",
         clientSecret:"xxxxxxxxxxxxxxxxxxxx",
         redirect:"/auth/google/redirect",
     },
     facebook: {
         clientId: "xxxxxxxxxxxxxxxxxxxx",
         clientSecret: "xxxxxxxxxxxxxxxxxxxx",
         redirect: "/auth/facebook/redirect"
     },
     twitter:{
 
     },
     jwt:{
         secret:"xxxxxxxxxxxxxxxxxxxx"
     },
     gmail:{
         username:"xxxxxxxxxxxxxxxxxxxx",
         password:"xxxxxxxxxxxxxxxxxxxx"
     }
 }
 </code>
 </pre>
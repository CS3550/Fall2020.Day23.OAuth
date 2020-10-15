const express = require('express')
const axios = require('axios');
const path = require('path');
const app = express()

const secrets = require("./secrets.js")


app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')))

app.get("/login", (req, res) => {
 res.redirect(`https://github.com/login/oauth/authorize?client_id=${secrets.client_id}&redirect_uri=http://localhost:3000/callback&state=${secrets.state}`)
})

app.get("/callback", (req, res)=>{
  console.log(`got a callback with url params ${req.query.code} and ${req.query.state}`);
  axios.post("https://github.com/login/oauth/access_token",{
    client_id: secrets.client_id,
    client_secret: secrets.client_secret,
    redirect_uri: "http://localhost:3000/callback",
    state:secrets.state,
    code: req.query.code
  },{headers:{Accept:"application/json"}})
  .then(response=>{
    let access_token = response.data.access_token;
    console.log("Github said " + access_token);
    return axios.get("https://api.github.com/user",
    {
      headers:{
        Authorization: `token ${access_token}`
      }
    })
  })
  .then(response=>{
    res.send(response.data);
    //res.sendFile(path.join(__dirname, "./private/private.html"))
  })
  .catch(error=>{
    console.log("There was an error " + error);
  })
})

app.get("/logout", (req, res) => {
  console.log("Logout");
  res.sendFile(path.join(__dirname, './public/index.html'))
})

app.listen(3000, () => console.log('Example app listening on port http://localhost:3000'))

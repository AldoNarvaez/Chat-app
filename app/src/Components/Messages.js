import "./Message.css"
import React, {useState, useEffect} from "react";
import Button from '@material-ui/core/Button';
// import Box from "@mui/material/Box"
 //import { TextField } from '@material-ui/core';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';

const {request} = require('graphql-request')


const Messages = ({socket}) => {

    const [msg, setMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const [conversationID, setConversationID] = useState("");
    let ar=[]
    //  socket.on("message",(message)=>{
    //    console.log(message)
    //    setMessages([...messages,message])

    //  })
    //const myEmail=sessionStorage.getItem("email")
    //const queryAuth = `query{user(email:"${myEmail}"){username}}`;
    const querie2=`query{chats{roomName participants _id}}`
  request("/graphql2",querie2).then((data)=>{

    const datum= data.chats
    console.log(datum[0]._id)
    setConversationID(datum[0]._id)
  })



     useEffect(() => {
      socket.on("message",(message)=>{
         ar.push(message)
         setMessages(ar)
         setMsg(message)
      })
    }, []);
   
   
    function onChangeHandler(e){
        e.preventDefault()
       const message=e.target.value
       setMsg(message)
    }
    function handler(e) {
        e.preventDefault()
        setMessages([...messages,msg])
        setMsg("")
        socket.emit("joinRoom", conversationID)
        socket.emit("sendMessage", msg, conversationID)
        
    }


    return (

           <>

        <div className="chatBoxTop">
            <div className="messageTop">
              <ul>
            {messages.map(c =>{
          return(<li key={Math.random()} className="messageText">{c}</li>)
         })}
         </ul>
             </div>
        </div>
        <FormControl component="form" onSubmit={handler} sx={{m:1, width: '100%' }} >
          <InputLabel >Write something</InputLabel>
          <OutlinedInput  onChange={onChangeHandler} required
            endAdornment={
              <InputAdornment position="end">

                <Button type="submit" >Send
                </Button>
              </InputAdornment>
            }
          />
        </FormControl>
        </>

    );
}

export default Messages;

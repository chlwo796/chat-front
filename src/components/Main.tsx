
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useEffect, useRef, useState } from "react";
import {
  MainContainer,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  Avatar,
  ChatContainer,
  ConversationHeader,
  VoiceCallButton,
  Message,
  MessageInput,
  VideoCallButton,
  InfoButton,
  MessageSeparator,
  TypingIndicator,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import { Client } from "@stomp/stompjs";
import { User } from "../types/User.type";
import { Msg } from "../types/Msg.type";
import axios from "axios";

export const Main = () => {
  const uiNum = JSON.parse(localStorage.getItem('user') || '').uiNum;
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [messageInputValue, setMessageInputValue] = useState("");
  const user = JSON.parse(localStorage.getItem('user')||'');
  const [users, setUsers] = useState<User[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [chatUser, setChatUser] = useState<User>({});
  const [typing, setTyping] = useState<boolean>(false);
  const client = useRef<any>({});

  const init = ()=>{
    client.current = new Client({
      brokerURL: `ws://localhost/react-chat`,
      onConnect: ()=>{
        client.current.subscribe(`/topic/enter-chat`,(data:any)=>{
          const tmpUsers = JSON.parse(data.body);
          setUsers(tmpUsers);
        });
  
        client.current.subscribe(`/topic/chat/${user.uiNum}`,(data:any)=>{
          const msg = JSON.parse(data.body);
          setMsgs(msgs=>[...msgs,msg])
        });

        client.current.subscribe(`/topic/chat-user/${user.uiNum}`,(data:any)=>{
          const chattingUser = JSON.parse(data.body);
          setChatUser(chattingUser);
        });

        client.current.subscribe(`/topic/chat-typing/${user.uiNum}`,(data:any)=>{
          const chattingMassage = JSON.parse(data.body);
            // chatUser = 현재채팅 상대방
            // chatMsg = 해당메세지의 발신자
            // 현재채팅방의 메세지만 이벤트되도록
            setTyping(chattingMassage.cmiMessage.length>0);
        });
        
        // client.current.subscribe(`/topic/chat-list/${user.uiNum}`,(data:any)=>{
        //   const chattingMassages = JSON.parse(data.body);
        //   setMsgs(chattingMassages);
        //   console.log(chattingMassages);
        // });

      },
      onDisconnect: ()=>{
        
      },
      connectHeaders:{
        Authorization: `Bearer ${user.token}`,
        uiNum : user.uiNum
      },
    });
    client.current.activate();
  }
  const getMsgs = async (chatUserUiNum:number|undefined) => {
    const res = await axios.get(`http://localhost/chat-list/${chatUserUiNum}/${uiNum}`,{
      headers: {
        Authorization: `${JSON.parse(localStorage.getItem('user') || '').token}`
      }
    });
    const json = res.data;
    console.log(json);
    //메세지내역을 보여줌
    setMsgs(res.data.list);
  }

  const publishMsg = () =>{
    client.current.publish({
      destination:`/publish/react-chat/${user.uiNum}`,
      body:JSON.stringify({
        cmiSenderUiNum : user.uiNum,
        cmiMessage : messageInputValue,
        cmiReceiveUiNum : chatUser?.uiNum
      })
    });

    setMessageInputValue('');
  }

  const scrollChat = (evt:any) => {
    if(loadingMore){
      return;
    }
    setLoadingMore(true);

    setLoadingMore(false);
  }

  useEffect(()=>{
    init();
  },[])

  return (
    <div className="auth-wrapper">
    <div
      style={{
        height: "600px",
        position: "relative"
      }}
    >
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <Search placeholder="Search..." />
          <ConversationList>
            {users.map((user,idx)=>(
              <Conversation key={idx}
              name={user.uiName}
              lastSenderName={user.uiName}
              info="Yes i can do it for you"
              style={{justifyContent: "start"}}
              onClick={async function(){
                setChatUser(user);
                getMsgs(user.uiNum);
                }}
              ><Avatar
              src={require("./images/ram.png")}
              name="Lilly"
              status={user.login?'available':'dnd'}
              />
              </Conversation>
          ))}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <Avatar src={require("./images/ram.png")} name={chatUser ? chatUser.uiName : ''} />
            <ConversationHeader.Content
              userName={chatUser ? chatUser.uiName : ''}
              info={chatUser.loginDate ? chatUser.loginDate : ''}
            />
            <ConversationHeader.Actions>
              <VoiceCallButton />
              <VideoCallButton />
              <InfoButton />
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
           onYReachStart={scrollChat}
           loadingMore={loadingMore}
            typingIndicator={typing?<TypingIndicator content={chatUser.uiName + "님이 입력중입니다."}/>:''}
          >
            {
              msgs.map((msg)=>(
                <Message
              model={{
                message: msg.cmiMessage,
                sentTime: msg.cmiSentTime,
                sender: msg.cmiSender,
                direction: user.uiNum === msg.cmiSenderUiNum ? "outgoing" : "incoming",
                position: "normal"
              }}
              avatarSpacer={user.uiNum===msg.cmiSenderUiNum?true:false}
            >
              {user.uiNum===msg.cmiSenderUiNum?'':<Avatar src={require("./images/ram.png")} name="Zoe" />}
            </Message>
              ))
            }
            <MessageSeparator content="Saturday, 30 November 2019" />
          </MessageList>
          <MessageInput
            placeholder="Type message here"
            value={messageInputValue}
            onChange={async (val) => {
               await setMessageInputValue(val);
                  client.current.publish({
                    destination: `/publish/chat-typing/${user.uiNum}`,
                    body: JSON.stringify({
                      cmiSenderUiNum: user.uiNum,
                      cmiMessage: messageInputValue ? messageInputValue : ' ',
                      cmiReceiveUiNum: chatUser?.uiNum
                     })
                  })
            }}
            onSend={publishMsg}
          />
        </ChatContainer>

        {/* <Sidebar position="right">
          <ExpansionPanel open title="INFO">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="LOCALIZATION">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="MEDIA">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="SURVEY">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
          <ExpansionPanel title="OPTIONS">
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
            <p>Lorem ipsum</p>
          </ExpansionPanel>
        </Sidebar> */}
      </MainContainer>
    </div>
    </div>
  );
}
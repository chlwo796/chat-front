import { ChatContainer, MainContainer, Message, MessageInput, MessageList, MessageModel } from "@chatscope/chat-ui-kit-react";

export const Chat = () => {
    const message:MessageModel = {
        message: '안녕',
        sentTime : '13:50:00',
        sender : '울랄라',
        direction : 'incoming',
        position : 'single'
    }
    return (
        <div style={{position:"relative", height:"600px"}}>
            <MainContainer>
                <ChatContainer>
                    <MessageList>
                        <Message model={message}></Message>
                    </MessageList>
                    <MessageInput placeholder="웃어"/>
                </ChatContainer>
            </MainContainer>
        </div>
    );
}
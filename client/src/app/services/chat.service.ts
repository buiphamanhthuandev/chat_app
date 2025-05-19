import { inject, Injectable, signal } from '@angular/core';
import { User } from '../models/User';
import { AuthService } from './auth.service';
import * as signalR from '@microsoft/signalr';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private authService = inject(AuthService);
  private hubUrl = 'http://localhost:5000/hubs/chat';
  currentOpenedChat = signal<User|null>({} as User);
  isLoaing = signal<boolean>(true);
  onlineUsers = signal<User[]>([]);
  chatMessages = signal<Message[]>([]);

  autoScrollEnabled = signal<boolean>(true);

  private hubConnection?: signalR.HubConnection;
  startConnection(token: string, senderId?: string){
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?senderId=${senderId || ''}`,{
        accessTokenFactory:()=> token
      }).withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => {
        console.log("Connection started")
      })
      .catch((error) => {
        console.log("Connection or login error ", error)
      });

    this.hubConnection!.on('OnlineUsers',((user:User[]) => {
      console.log(user);
      this.onlineUsers.update(() =>
        user.filter((user)=> user.userName !== this.authService.currentLoggedUser!.userName)
      );
    }));

    this.hubConnection!.on("ReceiveMessageList", (newMessages: Message[]) => {
      this.isLoaing.update(() => true);
      this.chatMessages.update(messages => {
        const checkMessage = newMessages.filter(newMessage => !messages.some(existsMessage => existsMessage.id === newMessage.id));
        if(checkMessage.length > 0){
          return [...checkMessage, ...messages];
        }
        return messages;
      });
      this.isLoaing.update(() => false);
    });

    this.hubConnection!.on("ReceiverNewMessage", (message: Message) => {
      document.title = '(1) New Message';
      this.chatMessages.update((messages) => [...messages, message]);
    })
  }

  disConnnection(){
    if(this.hubConnection?.state == signalR.HubConnectionState.Connected){
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }
  status(userName : string):string{
    const currentChatUser = this.currentOpenedChat();
    if(!currentChatUser){
      return 'online';
    }

    const onlineUser = this.onlineUsers().find(
      (user) => user.userName === userName
    )

    return onlineUser?.isTyping ? 'Typing ...' : this.isUserOnline();
  }
  isUserOnline(){
    let onlineUser = this.onlineUsers().find( user => user.userName === this.currentOpenedChat()?.userName);
    return onlineUser?.isOnline ? 'online' : this.currentOpenedChat()!.userName;
  }
  loadMessages(pageNumber:number){
    this.isLoaing.update(() => true);
    this.hubConnection?.invoke("LoadMessages", this.currentOpenedChat()?.id, pageNumber)
      .then()
      .catch()
      .finally(() => {
        this.isLoaing.update(() => false);
      })
  }

  sendMessage(messageString: string) {
    const countMsg = this.chatMessages.length;
    this.chatMessages.update((messages) => [
      ...messages,
      {
        content : messageString,
        senderId : this.authService.currentLoggedUser?.id || null,
        receiverId : this.currentOpenedChat()?.id || null,
        createdDate : new Date().toString(),
        isRead : false,
        id : countMsg + 1
      }
    ]);
    this.hubConnection?.invoke("SendMessage", {
      receiverId: this.currentOpenedChat()?.id,
      content: messageString
    }).then((id) => {
      console.log("message send to", id);
    }).catch((error) => {
      console.log(error);
    })
  }
}

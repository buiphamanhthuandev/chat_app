import { MatIconModule } from '@angular/material/icon';
import { Component, inject, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { ChatService } from '../../services/chat.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-chat-sidebar',
  imports: [MatIconModule, MatMenuModule, TitleCasePipe],
  templateUrl: './chat-sidebar.component.html',
  styles: ``
})
export class ChatSidebarComponent implements OnInit{ //

  authService = inject(AuthService);
  chatService = inject(ChatService);

  router = inject(Router);

  logout(){
    this.authService.logout();
    this.router.navigate(["/login"]);
    this.chatService.disConnnection();
  }

  ngOnInit(): void {
    this.chatService.startConnection(this.authService.getAccessToken!);
  }

  openChatWindow(user: User){

   if(this.chatService.currentOpenedChat()?.userName !== user.userName){
    this.chatService.currentOpenedChat.set(user);
    console.log("currentopenchat: ",this.chatService.currentOpenedChat()?.userName);
    console.log("user: ",user.userName);
    this.chatService.chatMessages.update(() => []);
   }
   this.chatService.loadMessages(1);
  }

}

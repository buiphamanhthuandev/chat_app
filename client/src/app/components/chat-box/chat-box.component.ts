import { AfterViewChecked, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-chat-box',
  imports: [MatProgressSpinner, MatIconModule, NgFor, NgIf],
  templateUrl: './chat-box.component.html',
  styles: ``
})
export class ChatBoxComponent implements AfterViewChecked{


  @ViewChild('chatBox',{ read : ElementRef }) public chatBox? : ElementRef;

  chatService = inject(ChatService);
  authService = inject(AuthService);
  private pageNumber = 1;
  private previousScrollHeight = 0;
  private shouldRestoreScroll = true;

  loadMoreMessage(){
    const chatBoxEl = this.chatBox?.nativeElement;
    if(!chatBoxEl) return;

    this.previousScrollHeight = chatBoxEl.scrollHeight;
    this.shouldRestoreScroll = true;

    this.pageNumber++;
    this.chatService.loadMessages(this.pageNumber);
  }

  trackById(index: number, message: any): any{
    return message.id;
  }

  ngAfterViewChecked(): void {
    const chatBoxEl = this.chatBox?.nativeElement;
    if(this.shouldRestoreScroll && chatBoxEl){
      const newScrollHeight = chatBoxEl.scrollHeight;
      const heightDiff = newScrollHeight - this.previousScrollHeight;

      chatBoxEl.scrollTop += heightDiff;
      this.shouldRestoreScroll = false;
    }
    if(this.chatService.autoScrollEnabled()){
      this.scrollToBottom();
    }
  }
  scrollToBottom(){
    this.chatService.autoScrollEnabled.set(true);
    this.chatBox!.nativeElement.scrollTo({
      top:this.chatBox!.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  }
  scrollTop(){
    this.chatService.autoScrollEnabled.set(false);
    this.chatBox!.nativeElement.scrollTo({
      top:0,
      behavior: 'smooth'
    });
  }
}

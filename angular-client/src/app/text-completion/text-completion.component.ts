import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import {
  PromptOutput,
  PromptRequestEvent,
} from '@progress/kendo-angular-conversational-ui';
import { OpenAiService } from '../openai.service';
import { UserService } from '../user.service';
import { arrayToString, stringsToArray } from '../utils/helper-methods';

@Component({
  selector: 'app-text-completion',
  templateUrl: './text-completion.component.html',
  styleUrl: './text-completion.component.css',
  encapsulation: ViewEncapsulation.None
})
export class TextCompletionComponent {
  public allergies: string[] = [];

  constructor(private aiService: OpenAiService, private userService: UserService, private zone: NgZone) {
    this.userService.getAllergy().then((res) => {
      this.allergies = stringsToArray(res);
    });
  }

  public activeView: number = 0;
  public promptOutputs: Array<PromptOutput> = [];
  private idCounter = 0;
  public loading = false;
  public keyword: string = '';
  public promptSuggestions: Array<string> = [
    "Безопасно ли е да ям мусака?",
    "Има ли проблем ако ям спагети?",
    "Опасно ли е да вечерям пиле с ориз?"
  ];

  public onPromptRequest(ev: PromptRequestEvent): void {
    if(ev.isRetry){
      this.activeView = 0;
      this.promptOutputs = [];
    } else {
      this.askAIText(ev);
    }
  }
  
  private askAIText(ev: PromptRequestEvent): void{
    this.loading = true;
    this.activeView = 1;

    if (ev.prompt && this.allergies){
      let allergies = arrayToString(this.allergies);

      this.aiService.askText(ev.prompt, allergies).then((res) => {
        const aiOutput = JSON.parse(res);
        this.keyword = aiOutput.keyword;

        const output: PromptOutput = {
          id: this.idCounter++,
          prompt: ev.prompt,
          title: this.keyword.toUpperCase(),
          output: `${aiOutput.details}`,
        };
        
        this.promptOutputs.unshift(output);
        this.loading = false;
        this.activeView = 2;
      })
    }
  }
}

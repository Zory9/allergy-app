import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import {
  PromptOutput,
  PromptRequestEvent,
} from '@progress/kendo-angular-conversational-ui';
import { OpenAiService } from '../openai.service';
import { UserService } from '../user.service';
import { cameraIcon, imageAddIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { arrayToString, stringsToArray } from '../utils/helper-methods';
import { FileInfo, FileRestrictions, FileSelectComponent, RemoveEvent, SelectEvent } from '@progress/kendo-angular-upload';
import { CameraComponent } from '../camera/camera.component';
import { CameraMobileComponent } from '../camera-mobile/camera-mobile.component';

@Component({
  selector: 'app-image-completion',
  templateUrl: './image-completion.component.html',
  styleUrl: './image-completion.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ImageCompletionComponent {
  public allergies: string[] = [];
  public isMobile: boolean = false;

 constructor(private aiService: OpenAiService, private userService: UserService, private zone: NgZone) {
  this.userService.getAllergy().then((res) => {
    this.allergies = stringsToArray(res);
  });

  this.isMobile = window.matchMedia("only screen and (max-width: 786px)").matches;
 }

  public activeView: number = 0;
  public promptOutputs: Array<PromptOutput> = [];
  private idCounter: number = 0;
  public loading: boolean = false;
  public keyword: string = '';
  public cameraSVG: SVGIcon = cameraIcon;
  public imageSVG: SVGIcon = imageAddIcon;
  public base64img: string = '';
  public myRestrictions: FileRestrictions = {
    allowedExtensions: [".jpg", ".jpeg", ".png"],
  };
  public showCamera: boolean = false;
  public showAnalyzeButton: boolean = false;
  public uploadSuccess: boolean = false;
  public showCameraWrapper: boolean = true;
  public showMobileInput: boolean = false;

  private askAIImage(): void{
    this.loading = true;
    this.activeView = 1;
    
    if (this.base64img && this.allergies){
      let allergies = arrayToString(this.allergies);

      this.aiService.askImage(this.base64img, allergies).then((res) => {
        const aiOutput = JSON.parse(res);
        this.keyword = aiOutput.keyword;
        const output: PromptOutput = {
          id: this.idCounter++,
          prompt: '',
          title: this.keyword.toUpperCase(),
          output: aiOutput.details,
        };
        
        this.promptOutputs.unshift(output);
        this.loading = false;
        this.activeView = 2;
      })
    }
  }

  public onPromptRequest(ev: PromptRequestEvent): void {
    if(ev.isRetry){
      this.uploadSuccess = false;
      this.showAnalyzeButton = false;
      this.showCamera = false;
      this.showCameraWrapper = true;
      this.base64img = '';
      this.showMobileInput = false;
      this.activeView = 0;
      this.promptOutputs = [];
    } else {
      this.askAIImage();
    }
  }

  public onSelect(ev: SelectEvent): void{
    this.showCameraWrapper = false;
    const files = ev.files;

    if (files) {
      files.forEach((file: FileInfo) => {
        if (
          file.rawFile &&
          !file.validationErrors
        ) {
          const reader = new FileReader();

          reader.onloadend = () => {
            this.base64img = reader.result as string;
            this.uploadSuccess = true;
          };

          reader.readAsDataURL(file.rawFile);
        }
      });
    }
  }

  public onRemove(): void{
    this.uploadSuccess = false;
    this.base64img = '';
    this.showCameraWrapper = true;
  }

  public openCamera(): void{
    this.showCamera = true;
  }

  public takeNewImage(appCamera: CameraComponent): void{
    appCamera.takeNewImage();
    this.showAnalyzeButton = false;
  }

  public takeNewImageMobile(appCameraMobile: CameraMobileComponent): void{
    this.showAnalyzeButton = false;
    this.showMobileInput = false;
    this.base64img = '';
    appCameraMobile.capturedImage = '';
    appCameraMobile.showCaptureButton = true;
    this.allergies = [...this.allergies];
  }

  public onImageReady(img: string): void {
    this.base64img = img;
    this.showAnalyzeButton = true;
  }

  public onImageReadyMobile(img: string): void {
    this.base64img = img;
    this.showAnalyzeButton = true;
    this.showMobileInput = true;
  }

  public analyzeImage(): void {
    this.askAIImage();
  }

  public clearUploadFiles(fs: FileSelectComponent): void{
    fs.clearFiles();
    this.uploadSuccess = false;
    this.showCameraWrapper = true;
  }
}

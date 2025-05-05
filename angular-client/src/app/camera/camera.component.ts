import { ChangeDetectorRef, Component, EventEmitter, HostListener, NgZone, Output, ViewEncapsulation } from '@angular/core';
import { Observable, Subject, take } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { SVGIcon, cameraIcon } from '@progress/kendo-svg-icons';
import { OpenAiService } from '../openai.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CameraComponent {
  public camButtonText: string = 'Направи снимка';
  public camData: any = null;
  public capturedImage: string = '';
  private trigger: Subject<void> = new Subject<void>();
  public svgCamera: SVGIcon = cameraIcon;
  @Output() imageReady = new EventEmitter<string>();

  public get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }

  public ngOnInit(): void {
    this.checkPermission();
  }

  constructor(public zone: NgZone){}

  public width: number;
  public height: number;
  
  public handleCapture(webcamImage: WebcamImage): void {
    this.capturedImage = webcamImage.imageAsDataUrl;
    this.imageReady.emit(this.capturedImage);
    this.stopCamera();
  }

  public captureImage(): void {
    this.trigger.next();
  }

  public checkPermission(): void {
    if (this.capturedImage !== ''){
      this.capturedImage = '';
    }

    navigator.mediaDevices
      .getUserMedia({ video: { width: 500, height: 500 } })
      .then((res) => {
        this.camData = res;

        this.zone.onStable.pipe(take(1)).subscribe(() => {
          const camera = document.querySelector('.camera');
          this.width = camera.clientWidth;
        });

      })
      .catch((err) => {
        console.log(err);
      });
  }

  public takeNewImage(): void {
    this.camData = '';
    this.checkPermission();
  }
  
  private stopMediaTracks(): void {
    if (this.camData) {
      this.camData
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      this.camData = null;
    }
  }

  public stopCamera(): void {
    this.stopMediaTracks();
  }
  
  public ngOnDestroy(): void {
    this.stopCamera();
    this.trigger.complete();
  }
}

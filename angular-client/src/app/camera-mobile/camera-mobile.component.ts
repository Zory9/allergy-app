import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-camera-mobile',
  templateUrl: './camera-mobile.component.html',
  styleUrl: './camera-mobile.component.css',
})
export class CameraMobileComponent {
  public capturedImage: string = '';
  public showCaptureButton: boolean = true;
  @Output() imageReady = new EventEmitter<string>();

  public onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      console.warn('No file selected.');
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      console.warn('Selected file is not an image.');
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      this.capturedImage = reader.result as string;
      this.imageReady.emit(this.capturedImage);
      this.showCaptureButton = false;
    };

    reader.readAsDataURL(file);
  }
}

import { Component, ViewEncapsulation } from '@angular/core';
import {
  cameraIcon,
  commentIcon,
  imageAddIcon,
  sparklesIcon,
  SVGIcon,
  warningTriangleIcon,
} from '@progress/kendo-svg-icons';
import { UserService } from '../user.service';
import { stringsToArray } from '../utils/helper-methods';

@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrl: './analyze.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AnalyzeComponent {
  public commentIcon: SVGIcon = commentIcon;
  public cameraIcon: SVGIcon = cameraIcon;
  public imageAddIcon: SVGIcon = imageAddIcon;
  public sparklesIcon: SVGIcon = sparklesIcon;
  public warningTriangleIcon: SVGIcon = warningTriangleIcon;
  public allergies: string[] = [];

  constructor(private userService: UserService) {
    this.userService.getAllergy().then((res) => {
      this.allergies = stringsToArray(res);
    });
  }
}

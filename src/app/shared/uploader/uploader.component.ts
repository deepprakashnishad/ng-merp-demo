import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent {

  isHovering: boolean;
  @Input() displayUploadedFiles:boolean = false;
  @Input() maxAllowedFileSize: number; // In KB
  @Input() isMultiple = true;
  @ViewChild('fileInput') fileInput;
  files: File[] = [];

  @Input() uploadPath;
  @Output() imageUploaded: EventEmitter<any>= new EventEmitter();

  constructor(
    private notifier: NotifierService
  ){

  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  onDrop(files: FileList) {
    if(this.isMultiple){
      for (let i = 0; i < files.length; i++) {
        this.files.push(files.item(i));
      }
    }else{
      this.files[0] = files.item(0);
    }
  }

  imageUploadComplete(downloadUrl, uploadPath){
    this.imageUploaded.emit({downloadUrl: downloadUrl, uploadPath: uploadPath});
  }

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: File[] = this.fileInput.nativeElement.files;
    for (let i = 0; i < files.length; i++) {
      if(this.maxAllowedFileSize===undefined || files[i].size < this.maxAllowedFileSize*1024){
        this.files.push(files[i]);
      }else{
        this.notifier.notify("error", `Maximum allowed size is ${this.maxAllowedFileSize} KB`);
      }
    }
  }
}

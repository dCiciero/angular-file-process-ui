import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploaderService } from 'src/app/services/uploader.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  files?:any  = [];
  fileContentType = "";
  progress = 0;
  message = '';
  divBy3 = '';
  divBy5 ="";
  divBy7 = '';
  evenNums = "";
  oddNums = "";
  modeNum = "";
  medianNum = "";

  fileInfos?: Observable<any>;

  constructor(private uploadService: UploaderService) { }
  
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
              this.message = "Upload is successful";
              this.currentFile = undefined;
              this.selectedFiles = undefined;
              this.showUploadedFiles();
              
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
            }
          },
          
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }

  downloadfile()
  {
    return this.uploadService.downloadFile()
    
  }

  processDoc()
  {
    this.uploadService.processFiles()
    this.uploadService._calculatedValues$.subscribe({
      next: (value: any) => {
        this.divBy3 = value[0].divBy3;
        this.divBy5 = value[0].divBy5;
        this.divBy7 = value[0].divBy7;
        this.evenNums = value[0].evenNums;
        this.oddNums = value[0].oddNums;
        this.modeNum = value[0].mode;
        this.medianNum = value[0].median;
  
        
      },
      error: (err: any) => {
        this.message = "Error processing document, please confirm it's uploaded";
        console.log(err.error.message)
      }
    })
   
  }

  showUploadedFiles()
  {
    this.uploadService.getFile().subscribe({
      next: (data: any) => {
        console.log(data)
        this.files = data[0]['value'];
        this.uploadService.fileContentType = data[1]['value']
        console.log(data[0]['value'])
        console.log(data[1]['value'])
      }
    })
    // this.files = this.uploadService.files;
  }

  ngOnInit(): void {
    this.showUploadedFiles();
  }
}

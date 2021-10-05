import { Component, OnInit } from '@angular/core';
import {FileUploadService } from '../Services/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from '../Global';

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {

  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  Path : String;

  fileInfos: Observable<any>;

  constructor(private uploadService: FileUploadService,
    public gl: Global) { }

    ngOnInit(): void {
      this.Path = this.uploadService.getPath();
      this.fileInfos = this.uploadService.getFiles(this.Path);
    }

  selectFiles(event): void {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }

  uploadFiles(): void {
    this.message = '';
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(idx, file): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    this.uploadService.upload(file, this.Path).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.uploadService.getFiles(this.Path);

          // for(let i=0; i<this.selectedFiles.length;i++){
          //   console.log("selected files"+this.selectedFiles[i].type);
          // }
          // this.fileInfos.forEach((file)=>{
          //   console.log(file);
          // });
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }

  download(url,name){
    alert(url);
    location.href = `${url}?name=${name}&path=${this.Path}`;
   
  }
}

//second test  single file upload
// import { Component, OnInit } from '@angular/core';
// import {FileUploadService } from './file-upload.service';
// import { HttpEventType, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';


// @Component({
//     selector: 'app-root',
//     templateUrl: './app.component.html',
//     styleUrls: ['./app.component.css']
//   })
//   export class AppComponent {
//     title = 'frontend';
//     fileName : string;
//     urls=[];


//     selectedFiles: FileList;
//     currentFile: File;      //single file
//     progress = 0;           //single file
//     message = '';
  
  
//     fileInfos: Observable<any>;

//     ngOnInit(): void {
//       //this.fileInfos = this.uploadService.getFiles();
//     }

//   constructor(private uploadService: FileUploadService) { }

//   selectFile(event): void {
//     this.selectedFiles = event.target.files;
//   }

//   upload(): void {
//     this.progress = 0;
  
//     this.currentFile = this.selectedFiles.item(0);
//     this.uploadService.upload(this.currentFile).subscribe(
//       event => {
//         if (event.type === HttpEventType.UploadProgress) {
//           this.progress = Math.round(100 * event.loaded / event.total);
//         } else if (event instanceof HttpResponse) {
//           this.message = event.body.message;
//           this.fileInfos = this.uploadService.getFiles();
//         }
//       },
//       err => {
//         this.progress = 0;
//         this.message = 'Could not upload the file!';
//         this.currentFile = undefined;
//       });
//     this.selectedFiles = undefined;
//   }
// }


//   multiple files


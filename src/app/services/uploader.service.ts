import { Injectable, Output, Input, EventEmitter } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  private baseUrl = 'https://ogcicero-dev.azurewebsites.net';   //'http://localhost:5098'; // 
  files?: any = [];
  fileContentType = "";
  divBy3 = '';
  divBy5 ="";
  divBy7 = '';
  evenNums = "";
  oddNums = "";
  modeNum = "";
  medianNum = "";
  private calculatedValues$ = new BehaviorSubject<any>({});
  _calculatedValues$ = this.calculatedValues$.asObservable();
  
  setCalculatedValues(val: any){
    this.calculatedValues$.next(val);
  }
  

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file2Process', file);
    formData.append('altText', "This is an alternate text");
    formData.append('description', "This is a descriptive text");

    const req = new HttpRequest('POST', `${this.baseUrl}/sendfile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    // return this.http.post(baseUlr, formData);
    return this.http.request(req);
  }
   getFile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/showfile`)
    
  }
/*   getFile() {
    return this.http.get(`${this.baseUrl}/showfile`)
    .subscribe((data) => {
      this.files = data;
      console.log(data);
    })
    
  } */

  downloadFile()
  {
    return this.http.get(`${this.baseUrl}/downloadFile`, {responseType: `blob`})
    .subscribe((data: Blob) => {
      const blob = new Blob([data], { type: this.fileContentType});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      console.log(this.fileContentType);
      console.log("success");
    })
  }

  processFiles()
  {
    return this.http.get(`${this.baseUrl}/processOutput`)
    
    .subscribe((data: any )=> {
      console.log(data[0]);
      this.divBy3 = data[0].divBy3;
      this.calculatedValues$.next(data)
      // return data[0];

      
    });
    
    // // .subscribe(results => {
    // //   results.map(res => {
    // //     console.log(`Result from processing: ${res}`)

    // //   })
    // })
  }
}

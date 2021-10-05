import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private baseUrl = 'http://localhost:4000/AUfolder';
  uri= 'http://localhost:4000/AUfolder';

  constructor(private http: HttpClient) { }

  upload(file: File, path: String): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload?path=${path}`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(path: String): Observable<any> {
    return this.http.get(`${this.baseUrl}/files?path=${path}`);
  }
  getPath() {
    return localStorage.getItem('Path');
  }
  // -------------------- Home --------------------
  getUserCourses(Username, SemesterName)
  {
    return this.http.get(`${this.uri}/userCourses?username=${Username}&semesterName=${SemesterName}`);
  }
  setCourseClass(course,classes)
  {
    localStorage.setItem("course", course);
    localStorage.setItem("classes", JSON.stringify(classes));
  }
  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }
  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }
  IsStartReg(){
    return this.http.get(`${this.uri}/StartReg`);
  }
}
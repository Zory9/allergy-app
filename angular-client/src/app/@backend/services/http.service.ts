import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable} from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private readonly url: string = "http://localhost:3000";

  public jwtToken: string = "";

  constructor(private httpClient: HttpClient) { }

  private post(endpoint: string, body: any) {
    return this.httpClient.post(`${this.url}${endpoint}`, body);
  }

  private imagePost(endpoint: string, body: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Access-Control-Allow-Origin', 'http://localhost:4200');
    headers = headers.append('Access-Control-Allow-Credentials', 'true');
    return this.httpClient.post(`${this.url}${endpoint}`, body, {
      headers: headers,
    });
  }

  private usersPost(endpoint: string, body: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append(
      "x-access-token",
      this.jwtToken ? this.jwtToken : ""
    );
    return this.httpClient.post(`${this.url}${endpoint}`, body, {
      headers: headers,
    });
  }

  private usersGet(endpoint: string, queryParams: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append(
      "x-access-token",
      this.jwtToken ? this.jwtToken : ""
    );
    let params: HttpParams = new HttpParams();
    if (queryParams) {
      for (let key in queryParams) {
        params = params.append(key, queryParams[key]);
      }
    }

    return this.httpClient.get(`${this.url}${endpoint}`, {
      params: queryParams,
      headers: headers,
    });
  }

  public getProfile(id: string): Observable<any> {
    return this.usersGet("/users", {
      id: id,
    });
  }

  public registerUser(
    username: string,
    email: string,
    password: string,
    allergy: string,
  ): Observable<any> {
    return this.usersPost("/users/register", {
      username: username,
      email: email,
      password: password,
      allergy: allergy,
    });
  }

  public loginUser(email: string, password: string): Observable<any> {
    return this.usersPost("/users/login", {
      email: email,
      password: password,
    });
  }

  public updateUser(id: string, email: string, username: string, allergy: string): Observable<any> {
    return this.usersPost("/users/update", {
      id: id,
      email: email,
      username: username,
      allergy: allergy
    })
  }

  public askAIText(question: string, allergy: string): Observable<any> {
    return this.post("/ai/text", {
      question: question,
      allergy: allergy
    });
  }

  public askAIImage(image: string, allergy: string): Observable<any> {
    return this.imagePost("/ai/image", {
      image: image,
      allergy: allergy
    });
  }

  public askAIGenerateRecipe(allergy: string, ingredients: string, cuisine: string, mealtype: string, cooktime: string): Observable<any> {
    return this.post("/ai/genrecipe", {
      allergy: allergy,
      ingredients: ingredients,
      cuisine: cuisine,
      mealtype: mealtype,
      cooktime: cooktime
    });
  }

  public askAIModifyRecipe(allergy: string, recipe: string): Observable<any> {
    return this.post("/ai/modrecipe", {
      allergy: allergy,
      recipe: recipe
    });
  }
}

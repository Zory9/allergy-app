import { Injectable } from '@angular/core';
import { HttpService } from './@backend/services/http.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { User } from './types/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private tokenKey = 'authToken';
  public registerSuccess: boolean = false;
  public registerError: boolean = false;
  public user: User | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpService, private router: Router) {
    const token = this.getToken();
    this.isLoggedInSubject.next(!!token);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    return decodedToken.id;
  }

  public async getAllergy(): Promise<string | null> {
    const userId = this.getUserId();

    try {
      const user = await this.getUser(userId);
      return user.allergy ?? null;
    } catch (error) {
      return null;
    }
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/home']);
  }

  public async getUser(id: string): Promise<User> {
    const req = this.http.getProfile(id);
    let user;

    await firstValueFrom(req)
      .then((data) => {
        user = data;
      })
      .catch((err) => {
        throw err;
      });

    return user;
  }

  public async login(email: string, password: string) {
    const req = this.http.loginUser(email, password);

    await firstValueFrom(req)
      .then((data) => {
        const token = data.token;

        localStorage.setItem(this.tokenKey, token);
        this.isLoggedInSubject.next(true);
        this.router.navigate(['/analyze']);
      })
      .catch((err) => {
        throw err;
      });
  }

  public async register(
    username: string,
    email: string,
    password: string,
    allergy: string
  ) {
    const req = this.http.registerUser(
      username,
      email,
      password,
      allergy
    );

    await firstValueFrom(req)
      .then((data) => {
        this.registerSuccess = true;
      })
      .catch((err) => {
        this.registerError = true;
      });
  }

  public async updateUserInfo(
    id: string,
    email: string,
    username: string,
    allergy: string
  ) {
    const req = this.http.updateUser(id, email, username, allergy);
    let user;

    await firstValueFrom(req)
      .then((data) => {
        user = data;
      })
      .catch((err) => {
        throw err;
      });

    return user;
  }
}

export class User {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  allergy: string;
  severity?: string;
  constructor(
    id: number,
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    allergy: string,
    severity: string
  ) {
    this.id = id ?? null;
    this.username = username ?? '';
    this.email = email ?? '';
    this.password = password ?? '';
    this.firstName = firstName ?? '';
    this.lastName = lastName ?? '';
    this.allergy = allergy ?? '';
    this.severity = severity ?? '';
  }
}

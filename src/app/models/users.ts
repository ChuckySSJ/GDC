export class User {

    id?: number;
    name?: string;
    password?: string;
    firstSurname?: string;
    secondSurname?: string;
    userName?: string;
    usuario?: string;
    role?: string;
    email?: string;
    isActive: boolean = false;

    constructor() {
        this.userName = '';
        this.password = '';
    }

}
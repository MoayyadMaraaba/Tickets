class User {
    FullName: string;
    Email: string;
    Password: string;
    PhoneNumber: string;
    Role: string;
    Activation: number;
    
    constructor(FullName: string, Email: string, Password: string, PhoneNumber: string, Role: string, Activation: number) {
        this.FullName = FullName;
        this.Email = Email;
        this.Password = Password;
        this.PhoneNumber = PhoneNumber;
        this.Role = Role;
        this.Activation = Activation;
    }



    print() {
        console.log(`Full Name: ${this.FullName} Email: ${this.Email} Password: ${this.Password} Phone number: ${this.PhoneNumber} Role: ${this.Activation} Activation: ${this.Activation}`);
    }
}

export default User;
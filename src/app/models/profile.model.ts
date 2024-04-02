export class Profile {
    exists: boolean = false;
    address: string; 
    alias: string = '';
    description: string = '';
    site: string = '';
    email: string = '';
    instagram: string = '';
    github: string = '';
    twitter: string ='';
    telegram: string = '';
    
    public constructor(address: string, init?: Partial<Profile>) {
      this.address = address;
      Object.assign(this, init)
    }

  }
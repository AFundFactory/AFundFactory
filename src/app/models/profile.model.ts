export class Profile {
    address: string; 
    alias: string = '';
    description: string = '';
    site: string = '';
    email: string = '';
    exists: boolean = false;
    github: string = '';
    twitter: string ='';

    
    constructor(address: string)  {
      this.address = address;
     }
  }
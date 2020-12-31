import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myspace',
  templateUrl: './myspace.component.html',
  styleUrls: ['./myspace.component.css']
})
export class MyspaceComponent implements OnInit {

  usDealOwners = [];
  indiaDealOwners = [];

  dealOwners:{[key:string]:Array<string>} = (localStorage.getItem('userCountry') == 'US') ?
                  {'Ratan Chopra':['Ratan_Chopra','jpg'], 'Cara Verba':['Cara_Verba','jpg'], 'Rohit Panda':['Rohit_Panda','jpg']} :
                  {'Tanveer S':['myspace_1','png'], 'Khyati B':['myspace_2','png'], 'Daniel R':['myspace_3','png']} ;
  
  dealOwnerCountry = (localStorage.getItem('userCountry') == 'US') ? 'US' : 'India';
  constructor() { }

  ngOnInit(): void {
    console.log(this.dealOwners);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { HttpClient }    from '@angular/common/http';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  public contactForm: FormGroup;
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 12;
  ContactInfo;
  constructor(public formBuilder: FormBuilder, public MyHttp: HttpClient) {
    this.UpdateContact()
// console.table(this.ContactInfo);

  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  public onContactFormSubmit(values:Object):void {
    if (this.contactForm.valid) {
      console.log(values);
    }
  }

  public UpdateContact(){
    console.log("Function Called")
    return this.MyHttp.get("http://localhost:3000/LoginInfo").subscribe(DBinfo => this.ContactInfo = DBinfo,
        err => console.log(err),
        () => console.table(this.ContactInfo));
  }

}

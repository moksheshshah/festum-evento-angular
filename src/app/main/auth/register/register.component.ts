import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SnotifyService} from 'ng-snotify';
import {GlobalService} from 'src/app/services/global.service';
import {GlobalFunctions} from '../../common/global-functions';
import { ModalService } from '../../_modal';
import {AuthService} from '../auth.service';
import {FuseValidators} from '../validators';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from "ngx-intl-tel-input";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  PhoneNumberFormat = PhoneNumberFormat;
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, Validators.required),
  });
  @ViewChild('phoneF') form: any;

  @ViewChild('registerNgForm') registerNgForm: any;
  registerForm: any;
  agentId: any;

  pwd: boolean = false;
  confirmPwd: boolean = false;

  eventObj: any = {};

  get confirmPassword(): any {
    return this.registerForm.get('confirm_password');
  }

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _globalService: GlobalService,
    private _sNotify: SnotifyService,
    private _modalService: ModalService,
    private _activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.agentId = this._activatedRoute.snapshot.paramMap.get('agentId');
    localStorage.clear();
    this.registerForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // mobile: ['', [Validators.required]],
      country_code: ['+91'],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      refer_code: [''],
      fcm_token: [''],
      agentid: [this.agentId || ''],
      tandc: [false, [Validators.requiredTrue]],
    }, {
      validators: FuseValidators.mustMatch('password', 'confirm_password')
    });
  }
  // confirm_password: ['', [Validators.required]],
  // role: [4],

  register(): void {    
    if (this.registerForm.invalid) {
      this.form.form.controls['phone'].touched = true;
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.controls[key].touched = true;
        this.registerForm.controls[key].markAsDirty();
      });
      return;
    }
    if (this.phoneForm.invalid) {
      this.form.form.controls['phone'].touched = true;
      this.phoneForm.controls['phone'].markAsDirty();
      return;
    }
    this.registerForm.disable();
    const preparedCompanyDetailsObj: any = this.prepareObj(this.registerForm.value);
    console.log(preparedCompanyDetailsObj);
    this._authService.register(preparedCompanyDetailsObj).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const preparedForgotPwdObj: any = preparedCompanyDetailsObj;
        preparedForgotPwdObj.smsKey = result.Data.key;
        preparedForgotPwdObj.organizerid = result.Data.organizerid;
        localStorage.setItem("register", JSON.stringify(preparedForgotPwdObj));
        this._router.navigate(['/otp']);
      } else {
        this._sNotify.error(result.Message, 'error');
        this.registerForm.enable();
        this._globalFunctions.successErrorHandling(result, this, true);
      }
    }, (error: any) => {
      this.registerForm.enable();
      // this.registerNgForm.resetForm();
      this._globalFunctions.errorHanding(error, this, true);
      // this._sNotify.error(error.Message, 'error');
    });
  }

  prepareObj(registerObj: any = {}): any {
    console.log(this.phoneForm?.value);
    
    const preparedObj: any = registerObj;
    preparedObj.country_wise_contact = this.phoneForm?.value?.phone;
    preparedObj.country_code = preparedObj.country_wise_contact?.dialCode;
    const contactNumber = preparedObj.country_wise_contact?.e164Number;
    preparedObj.mobile = contactNumber.replace(preparedObj.country_code, '');
    return preparedObj;
  }

  tAndCPop(): void {
    if (this.registerForm.value && this.registerForm.value.tandc == false) {
      this.registerForm.get('tandc').setValue(false);
      this._modalService.open("tandc");
      // this.registerForm.get('tandc').setValue(false);
    }else{
      this._modalService.open("tandc");
    }
  }

  closePop(): any {
    this.registerForm.get('tandc').setValue(false);
    if (this.registerForm.value && this.registerForm.value.tandc == false) {
      this.registerForm.get('tandc').setValue(false);
      // this._modalService.open("tandc");
      // this.registerForm.get('tandc').setValue(false);
      this._modalService.close("tandc");
    }

  }

  applyTAndC(): void {
    this.registerForm.get('tandc').setValue(true);
    this._modalService.close("tandc");
  }
}

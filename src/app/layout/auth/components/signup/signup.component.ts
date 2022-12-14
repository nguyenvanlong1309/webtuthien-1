import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';

import { AuthService } from 'src/app/services/auth.service';
import { Utils } from 'src/app/base/utils';
import { CustomValidators } from 'src/app/base/validators/custom.validator';
import { REGEX_PHONE_VIETNAME } from 'src/app/base/constant';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation()
  ]
})
export class SignupComponent implements OnInit,OnDestroy {

  private unsubscribe$: Subject<void> = new Subject();

  formGroup: FormGroup;

  public get formControl() {
    return this.formGroup.controls;
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ngBuildForm();
  }

  ngBuildForm(): void {
    this.formGroup = this.fb.group({
      fullName: [null, [Validators.required, CustomValidators.onlyText]],
      username: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, [Validators.required]],
      passwordConfirmation: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(REGEX_PHONE_VIETNAME)]],
      email: [null, [Validators.required, Validators.email]],
      address: [null],
      role: ['USER']
    })
  }

  ngSubmitForm(): void {
    Utils.beforeSubmitForm(this.formGroup);
    if (this.formGroup.invalid) {
      this.toastService.error('Thông tin không hợp lệ.');
      return;
    };
    const { value } = this.formGroup;
    if (value.password != value.passwordConfirmation) {
      this.toastService.error('Xác nhận mật khẩu không khớp.')
      return;
    }

    this.authService.regisUser(value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.toastService.success('Đăng ký thành công');
        this.router.navigate(['/auth', 'log-in']);
      })
  }

  ngOnDestroy(): void {
      this.unsubscribe$?.next();
      this.unsubscribe$?.complete();
  }


}

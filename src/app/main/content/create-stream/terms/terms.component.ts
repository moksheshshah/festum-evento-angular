import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { GlobalFunctions } from 'src/app/main/common/global-functions';
import { ModalService } from 'src/app/main/_modal';
import { CONSTANTS } from 'src/app/main/common/constants';
import { CreateStreamService } from '../create-stream.service';
// @ts-ignore
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as _ from 'lodash';
import { SnotifyService } from 'ng-snotify';
declare let $: any;

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsAndConditionsLsComponent implements OnInit, OnDestroy {
  constants: any = CONSTANTS;
  termsAndConditionsForm: any;
  isLoading: boolean = false;
  successfully: boolean = false;
  detailEditor = DecoupledEditor;
  editorConfig: any = {};
  agreeTAndC: boolean = false;
  liveStreamId: any;

  termsAndConditionsObj: any = {};

  textEditor: boolean = false;
  textEditorMaxLimit: any = this.constants.CKEditorCharacterLimit3;
  textEditorLimit: any = 0;

  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: ModalService,
    private _router: Router,
    private _globalFunctions: GlobalFunctions,
    private _createStreamService: CreateStreamService,
    private _sNotify: SnotifyService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    // if (!localStorage.getItem('lsId') || localStorage.getItem('lsId') == '') {
    //   this._router.navigate(['/live-stream']);
    // }
    this.liveStreamId = localStorage.getItem('lsId');
    this.getTAndCEvent();
    this.editorConfig = CONSTANTS.editorConfig;
    this._prepareTAndCForm(this.termsAndConditionsObj);
    this.termsAndConditionsForm.get('status').setValue(false);
  }

  onTextEditorReady(editor: any, fieldForSetData: any): void {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  tAndCPop(): void {
    if (this.termsAndConditionsForm.value && this.termsAndConditionsForm.value.status == false) {
      this.termsAndConditionsForm.get('status').setValue(false);
      this._modalService.open("tandc");
    }else{
      this._modalService.open("tandc");
    }
  }

  closePop(): any {
    this.termsAndConditionsForm.get('status').setValue(false);
    this._modalService.close("tandc");
  }

  applyTAndC(): void {
    this.termsAndConditionsForm.get('status').setValue(true);
    this._modalService.close("tandc");
  }

  // backBtn(): void {
  //   this._router.navigate(['/live-stream/create/personal-details']);
  // }

  getTAndCEvent(): any {
    this.isLoading = true;
    this._createStreamService.getTAndCById(this.liveStreamId).subscribe((result: any) => {
      if (result && result.IsSuccess) {
        const eventLocationObj: any = result?.Data?.tandc || {};
        this._prepareTAndCForm(eventLocationObj);
        this.isLoading = false;
      } else {
        this._globalFunctions.successErrorHandling(result, this, true);
        this.isLoading = false;
      }
    }, (error: any) => {
      this._globalFunctions.errorHanding(error, this, true);
      this.isLoading = false;
    });
  }

  editorCharacterSet(): any {
    const textfield = this.termsAndConditionsForm?.get('t_and_c')?.value;
    const stringOfCKEditor = this._globalFunctions.getPlainText(textfield);
    this.textEditorLimit = stringOfCKEditor.length;
    this.textEditor = (stringOfCKEditor.length > this.textEditorMaxLimit);
  }

  onBackCLick(): void {
    this._router.navigate(['/live-stream/create/personal-details']);
    // for first time we got some issue, tha is why we add another setTimeout
    setTimeout(() => {
      this._router.navigate(['/live-stream/create/personal-details']);
    }, 0);
  }

  public loadJsScript(): HTMLScriptElement {
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = '/assets/js/message-script.js';
    script.id = "messageScript";
    this.renderer.appendChild(this.document.body, script);
    return script;
  }

  saveFullEvent(): void {
    if (this.termsAndConditionsForm.invalid) {
      Object.keys(this.termsAndConditionsForm.controls).forEach((key) => {
        this.termsAndConditionsForm.controls[key].touched = true;
        this.termsAndConditionsForm.controls[key].markAsDirty();
      });
      return;
    }
    this.editorCharacterSet();
    if (this.textEditorLimit && this.textEditorMaxLimit && this.textEditorLimit > this.textEditorMaxLimit) {
      return;
    }
    if (this.termsAndConditionsForm?.value?.status != '') {
      this.isLoading = true;
      this.termsAndConditionsForm.disable();
      const preparedLocationObj: any = this.prepareTAndCEventObj(this.termsAndConditionsForm.value);
      this._createStreamService.saveLiveStreamTAndC(preparedLocationObj).subscribe((result: any) => {
        if (result && result.IsSuccess) {
          this.isLoading = false;
          this.termsAndConditionsForm.enable();
          this.successfully = true;
          this.loadJsScript();
          setTimeout(() => {
            this.successfully = false;
            this._router.navigate(['/live-stream']);
            // for first time we got some issue, tha is why we add another setTimeout
            setTimeout(() => {
              this._router.navigate(['/live-stream']);
            }, 0);
          }, 3000);
          // this._sNotify.success('Event Created And Update Successfully.', 'Success');
        } else {
          this._globalFunctions.successErrorHandling(result, this, true);
          this.isLoading = false;
          this.termsAndConditionsForm.enable();
        }
      }, (error: any) => {
        this._globalFunctions.errorHanding(error, this, true);
        this.isLoading = false;
        this.termsAndConditionsForm.enable();
      });
    }
  }

  prepareTAndCEventObj(locationObj: any = {}): any {
    const preparedLocationEventObj: any = locationObj;
    preparedLocationEventObj.livestreamid = this.liveStreamId;
    return preparedLocationEventObj;
  }

  private _prepareTAndCForm(eventObj: any = {}): void {
    this.termsAndConditionsForm = this._formBuilder.group({
      t_and_c: [eventObj?.t_and_c || '', [Validators.required]],
      facebook: [eventObj?.facebook || ''],
      youtube: [eventObj?.youtube || ''],
      twitter: [eventObj?.twitter || ''],
      pinterest: [eventObj?.pinterest || ''],
      instagram: [eventObj?.instagram || ''],
      linkedin: [eventObj?.linkedin || ''],
      status: [false, [Validators.requiredTrue]],
    });

    if (eventObj?.t_and_c) {
      this.editorCharacterSet();
    }
  }

  ngOnDestroy() {
    let elem = document.querySelector("#messageScript");
    if (elem) {
      document.querySelector("#messageScript").parentNode.removeChild(elem);
    }
  }
}
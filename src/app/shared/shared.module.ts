import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddEditEventDialogComponent } from "../main/content/dialogs/add-edit-event-dialog/add-edit-event-dialog.component";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ValidNumberDirective } from "../directives/valid-number.directive";
import { ValidNumberWithDecimalDirective } from "../directives/valid-number-with-decimal.directive";
import { ImageAndVideoPreviewComponent } from '../main/content/dialogs/image-and-video-preview/image-and-video-preview.component';
import { MessagePreviewComponent } from '../main/content/dialogs/message-preview/message-preview.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ValidAlphabetDirective } from '../directives/valid-alphabet.directive';
import { TooltipModule } from 'primeng/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TermsAndConditionsComponent } from '../main/common/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from '../main/common/privacy-policy/privacy-policy.component';
import { TermsAndConditionsUserComponent } from '../main/common/terms-and-conditions-user/terms-and-conditions.component';
import { PrivacyPolicyUserComponent } from '../main/common/privacy-policy-user/privacy-policy.component';
import { RPCPRulesComponent } from '../main/common/rpcp-rules/rpcp-rules.component';
import { BroadcastStreamSettingsComponent } from '../main/content/dialogs/broadcast-stream-settings/broadcast-stream-settings.component';


@NgModule({
  declarations: [
    AddEditEventDialogComponent,
    ImageAndVideoPreviewComponent,
    MessagePreviewComponent,
    BroadcastStreamSettingsComponent,
    ValidNumberDirective,
    ValidAlphabetDirective,
    ValidNumberWithDecimalDirective,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsUserComponent,
    PrivacyPolicyUserComponent,
    RPCPRulesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    MatProgressSpinnerModule,
    TooltipModule,
    MatTooltipModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddEditEventDialogComponent,
    ImageAndVideoPreviewComponent,
    MessagePreviewComponent,
    BroadcastStreamSettingsComponent,
    ProgressSpinnerModule,
    ValidNumberDirective,
    ValidAlphabetDirective,
    ValidNumberWithDecimalDirective,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    RPCPRulesComponent
  ]
})
export class SharedModule {
}

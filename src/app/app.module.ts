import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HrSideNavBarComponent } from './hr-side-nav-bar/hr-side-nav-bar.component';
import { HrTopNavBarComponent } from './hr-top-nav-bar/hr-top-nav-bar.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './homepage/homepage.component';
import { NavigationpageComponent } from './navigationpage/navigationpage.component';
import { MyspaceComponent } from './myspace/myspace.component';
import { TransitionComponent } from './transition/transition.component';
import { ReportsComponent } from './reports/reports.component';
import { OfferComponent } from './offer/offer.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { HighchartsChartModule } from 'highcharts-angular';

import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';

import { HttpClientModule , HTTP_INTERCEPTORS  } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { HrFooterComponent } from './hr-footer/hr-footer.component';
import { BlockCopyPasteDirective } from './block-copy-paste.directive';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DealsComponent } from './deals/deals.component';
import { DealsEditComponent } from './deals-edit/deals-edit.component';
import { ExploreTcsComponent } from './transitionPanels/explore-tcs/explore-tcs.component';
import { ContactUsComponent } from './transitionPanels/contact-us/contact-us.component';
import { InterviewSchedulerComponent } from './transitionPanels/interview-scheduler/interview-scheduler.component';
import { CandidateRegistrationComponent } from './transitionPanels/CandidateRegistrationForm/candidate-registration/candidate-registration.component';
import { StatusManagementComponent } from './transitionPanels/CandidateRegistrationForm/status-management/status-management.component';
import { ApplicationFormComponent } from './transitionPanels/CandidateRegistrationForm/application-form/application-form.component';
import {MyJourneyComponent} from './transitionPanels/my-journey/my-journey.component';
import { RecruiterProfileComponent } from './TransitionPanels/recruiter-profile/recruiter-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HrSideNavBarComponent,
    HrTopNavBarComponent,
    HomepageComponent,
    NavigationpageComponent,
    MyspaceComponent,
    TransitionComponent,
    ReportsComponent,
    OfferComponent,
    HrFooterComponent,
    BlockCopyPasteDirective,
    DealsComponent,
    DealsEditComponent,
    ExploreTcsComponent,
    InterviewSchedulerComponent,
    CandidateRegistrationComponent,
    StatusManagementComponent,
    ApplicationFormComponent,
    ContactUsComponent,
    MyJourneyComponent,
    RecruiterProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TabsModule.forRoot(),
    NgxExtendedPdfViewerModule,
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    ModalModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatRadioModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatGridListModule,
    MatCardModule,
    MatTabsModule,
    HighchartsChartModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

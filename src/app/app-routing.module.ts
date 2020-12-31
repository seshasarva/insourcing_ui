import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {MyspaceComponent} from './myspace/myspace.component';
import {NavigationpageComponent} from './navigationpage/navigationpage.component';
import {TransitionComponent} from './transition/transition.component';
import {ReportsComponent} from './reports/reports.component';
import {OfferComponent} from './offer/offer.component';
import {EvaluationComponent} from './evaluation/evaluation.component';
import {AccessComponent} from './access/access.component';
import {MyspacePage1Component} from './myspace-page1/myspace-page1.component';
import { AuthGuard } from './auth.guard';
import { LoggedinGuard } from './loggedin.guard';
import {DealsComponent} from './deals/deals.component';
import {DealsEditComponent} from './deals-edit/deals-edit.component';


const routes: Routes = [
  {path: '',component: HomepageComponent, },
  {path: 'navpage',canActivate: [AuthGuard], component: NavigationpageComponent , children: [
  { path: 'myspace',canActivate: [AuthGuard], component: MyspaceComponent , outlet: 'innerContent'},
      {path: 'transition',canActivate: [AuthGuard], component: TransitionComponent , outlet: 'innerContent'},
      {path: 'evaluation',canActivate: [AuthGuard], component: EvaluationComponent , outlet: 'innerContent'},
      {path: 'deals', canActivate: [AuthGuard], component: DealsComponent , outlet: 'innerContent'},
      {path: 'dealsEdit', canActivate: [AuthGuard], component: DealsEditComponent, outlet: 'innerContent'},
      {path: 'reports',canActivate: [AuthGuard], component: ReportsComponent , outlet: 'innerContent'},
      {path: 'offer',canActivate: [AuthGuard], component: OfferComponent  , outlet: 'innerContent'},
      {path: 'access',canActivate: [AuthGuard], component: AccessComponent , outlet: 'innerContent'},
      {path: 'myspace-page1', component: MyspacePage1Component , outlet: 'innerContent'}
]},
{path: '**',component: HomepageComponent, }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomepageComponent} from './homepage/homepage.component';
import {MyspaceComponent} from './myspace/myspace.component';
import {NavigationpageComponent} from './navigationpage/navigationpage.component';
import {TransitionComponent} from './transition/transition.component';
import {ReportsComponent} from './reports/reports.component';
import {OfferComponent} from './offer/offer.component';
import { AuthGuard } from './auth.guard';
import {DealsComponent} from './deals/deals.component';
import {DealsEditComponent} from './deals-edit/deals-edit.component';


const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'navpage', component: NavigationpageComponent , children: [
      { path: 'myspace', component: MyspaceComponent , outlet: 'innerContent'},
      {path: 'transition', component: TransitionComponent , outlet: 'innerContent'},
      {path: 'deals', component: DealsComponent , outlet: 'innerContent'},
      {path: 'dealsEdit', component: DealsEditComponent, outlet: 'innerContent'},
      {path: 'reports', component: ReportsComponent , outlet: 'innerContent'},
      {path: 'offer', component: OfferComponent  , outlet: 'innerContent'}
]}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

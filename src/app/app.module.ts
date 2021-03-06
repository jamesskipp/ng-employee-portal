import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';
import { EmployeesComponent } from './employees/employees.component';
import { HttpClientModule } from '@angular/common/http';
import { EmployeesService } from './employees/employees.service';
import { EmployeesResolver } from './employees/employees-resolver.service';
import { ErrorComponent } from './error/error.component';
import { AppRoutingModule } from './app-routing.module';
import { EmployeeListComponent } from './employees/employee-list/employee-list.component';
import { EmployeeResolver } from './employees/employee-resolver.service';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    EmployeesComponent,
    EmployeeDetailComponent,
    EmployeeListComponent,
    ErrorComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    EmployeesService,
    EmployeesResolver,
    EmployeeResolver,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

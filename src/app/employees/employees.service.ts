import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

import { Employee } from './employee.model';
import { Observable } from 'rxjs/Observable';
import { Params } from '@angular/router';

@Injectable()
export class EmployeesService implements OnInit {

  /**
   *
   */
  private _employees: Employee[];

  /**
   *
   */
  private _queryParams: Params;

  /**
   *
   */
  private _totalPages: number;

  /**
   *
   * @type {string}
   */
  private _employeesAPIUrl = 'http://localhost:8080/employees';

  constructor(private http: HttpClient) { }

  ngOnInit() {

  }

  get queryParams(): Params {
    return this._queryParams;
  }

  set queryParams(value: Params) {
    this._queryParams = value;
  }

  get employees(): Employee[] {
    return this._employees;
  }

  set employees(value: Employee[]) {
    this._employees = value;
  }

  get totalPages(): number {
    return this._totalPages;
  }

  set totalPages(value: number) {
    this._totalPages = value;
  }

  /**
   * fetchEmployees is responsible for updating the value of employees based on a
   * new set of parameters. It will only make a new http request if size or page has
   * changed, but it will always sort employees if sort has changed.
   *
   * @param {Params} queryParams
   * @returns {Promise<Employee[]>}
   */
  fetchEmployees(queryParams: Params): Promise<Employee[]> {
    // Check if page or size has changed to determine if an http request is needed
    if (this.queryParams['page'] !== queryParams['page'] || this.queryParams['size'] !== queryParams['size']) {
      // Return promise made by getRequestEmployees which resolves once the api gives its response
      return this.getRequestEmployees(queryParams['page'], queryParams['size'], queryParams['sort']).toPromise().then((data) => {
        // Set the new value of employees
        this.employees = this.mapEmployees(data);
        // Set the new value of queryParams
        this.queryParams = queryParams;
        // Set the new value of totalPages
        this.totalPages = data['page']['totalPages'];

        // Return the updated value of employees
        return this.employees;
      });
    // If only the sort param has changed, no http request is needed
    } else if (this.queryParams['sort'] !== queryParams['sort']) {
      // Sort the employees
      this.sortEmployees(queryParams['sort']);
      // Set the new value of queryParams
      this.queryParams = queryParams;
      // Return the new value of employees wrapped in a promise
      return Promise.resolve(this.employees);
    } else {
      return Promise.resolve(null);
    }
  }

  /**
   * Sorts employees based on the given sort attribute (sortAtr)
   * Returns void.
   *
   * @param {string} sortAtr the attribute to be sorted
   */
  sortEmployees(sortAtr: string): void {
    this.employees.sort((a, b): number => {
      if (a[sortAtr] < b[sortAtr]) { return -1 ; }
      if (a[sortAtr] > b[sortAtr]) { return 1; }
      return 0;
    });
  }

  /**
   *
   * @param {string} id
   * @returns {Employee | undefined}
   */
  getEmployee(id: string): Promise<Employee> {
    let employee;

    // See if the employee is already in the employees array
    if (this.employees) {
      employee = this.employees.find((employeeEl) => employeeEl.id === id);
    }

    // Return if its already there
    if (employee) {
      return Promise.resolve(employee);
    // Request the employee from the API
    } else {
      return this.getRequestEmployee(id).toPromise().then((data) => {
        const newEmp: Employee = this.mapEmployee(data);
        // Add the newly found employee to the array
        // this.employees.push(newEmp);
        return newEmp;
      }, () => {
        // Reject if not found
        return Promise.reject('Error finding employee ' + id);
      });
    }
  }

  /**
   * Make an http request to the employees rest api given the values for
   * page, size, and sort. Returns an observable.
   *
   * @param {string} page
   * @param {string} size
   * @param {string} sort
   * @returns {Observable<any>}
   */
  getRequestEmployees(page: string = '0', size: string = '25', sort: string = 'lastName'): Observable<any>  {
    console.log('GET ', this._employeesAPIUrl);
    return this.http.get(this._employeesAPIUrl, {
      params: {
        page,
        size,
        sort,
      },
    });
  }

  /**
   *
   * @param {string} id
   * @returns {Observable<any>}
   */
  getRequestEmployee(id = '0'): Observable<any> {
    return this.http.get(this._employeesAPIUrl + '/' + id);
  }

  /**
   * Maps the raw response received from the api to an array
   * of Employees
   *
   * @param {Object[]} employeesObj
   * @returns {Employee[]}
   */
  public mapEmployees(employeesObj: Object[]): Employee[] {
    const employees = [];

    employeesObj['_embedded']['employee'].forEach((employeeObj) => {
      employees.push(this.mapEmployee(employeeObj));
    });

    return employees;
  }

  /**
   * Takes a generic object and returns a new instance of the Employee
   * class.
   *
   * @param {Object} employeeObj
   * @returns {Employee}
   */
  public mapEmployee(employeeObj: Object) {
    const empSelfHref = employeeObj['_links']['self']['href'];
    const id = empSelfHref.substr(empSelfHref.lastIndexOf('/') + 1);

    return new Employee(
      employeeObj['firstName'],
      employeeObj['lastName'],
      employeeObj['salary'],
      employeeObj['hireDate'],
      id
    );
  }

}

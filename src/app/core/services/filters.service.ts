import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class Filter {

}

@Injectable({
  providedIn: 'root'
})
export class FiltersService {

  private filtersSubj: BehaviorSubject<Filter> = new BehaviorSubject<Filter>({});
  filtersObj = {};
  public filters = this.filtersSubj.asObservable();

  constructor() { }
}

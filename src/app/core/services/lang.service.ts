import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  private langSubj: BehaviorSubject<string> = new BehaviorSubject('en');
  public lang$ = this.langSubj.asObservable();

  constructor() { }

  setLang = (lang: string) => this.langSubj.next(lang);

  getLang = () => this.langSubj.value;
}

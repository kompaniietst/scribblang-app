import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { LangService } from 'src/app/core/services/lang.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input('title') title: string;

  constructor(private lang: LangService) { }

  ngOnInit() { }

}

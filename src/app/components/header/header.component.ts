import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() showBackBtn:boolean = true;
  @Input() showTickButton:boolean = true;
  @Input() showNextArrowButton:boolean = false;
  @Input() backTitle:string;
  @Input() title:string;
  @Input() showSaveButton:boolean = true;
  @Output() goBackBtnEvent = new EventEmitter();
  @Output() saveDataBtnEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {}
  goBack() {
    this.goBackBtnEvent.emit();
  }
  saveData() {
    this.saveDataBtnEvent.emit();
  }
}

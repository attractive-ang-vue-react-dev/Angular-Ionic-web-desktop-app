import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sort-by-type',
  templateUrl: './sort-by-type.component.html',
  styleUrls: ['./sort-by-type.component.scss'],
})
export class SortByTypeComponent implements OnInit {

  sortByList:any = [];
  @Output() public sortCard = new EventEmitter();

  ngOnInit() {
    this.sortByList.push({id:"creation_date", name:'offline_tool.labels.sort_by_options.creation_date'});
    this.sortByList.push({id:"project", name:'offline_tool.placeholders.quarter'});
    this.sortByList.push({id:"protocol", name:'offline_tool.labels.sort_by_options.protocol_type'});
  }
  selectSortByMethod(sortByItem) {
   this.sortCard.emit({ Type: sortByItem });
  }
}

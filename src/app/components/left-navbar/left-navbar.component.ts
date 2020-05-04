import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ObservableService } from '../../api/observable.service';

@Component({
  selector: 'app-left-navbar',
  templateUrl: './left-navbar.component.html',
  styleUrls: ['./left-navbar.component.scss'],
})
export class leftSidebarComponent implements OnInit {
  links: any = [];
  constructor(private router: Router,private storage: Storage,
    public observableService: ObservableService) {
  }
  @Input() current_page_id: any;
  async ngOnInit() {
    this.initSidebar();
    this.observableService.unSubscribedLink = this.observableService.getLinks().subscribe(async response => {
      this.links = response.links;
     await this.storage.set('links', this.links);
    });
  }
  ngOnDestroy() {
    this.observableService.unSubscribedLink.unsubscribe();
  }
  async initSidebar() {
    let current_index = await this.storage.get('current_index');
    this.links = await this.storage.get('links');
    if (current_index == -1) {
      if (this.current_page_id == 2) {
        this.links = this.observableService.modifyLinks(this.links, this.current_page_id);
      }
    } else if(current_index != -1) {
      let submit_data = await this.storage.get('submit_data');
      if (submit_data != null) {
        let completeComponents: any = [];
        if ((submit_data[current_index].protocol_type.id == 1 && submit_data[current_index].parties.unit_id == '') || (submit_data[current_index].protocol_type.id == 2 && submit_data[current_index].parties.unit_id == '') || (submit_data[current_index].protocol_type.id == 3 && submit_data[current_index].parties.unit_id == '')) {
          completeComponents = submit_data[current_index].floors;
        } else {
          completeComponents = submit_data[current_index].rooms;
        }
        this.links = this.observableService.modifyLinks(this.links, this.current_page_id, completeComponents);
      }
    }
    this.observableService.setLinks(this.links);
    await this.storage.set('links', this.links);
  }
  goToItemPage(item) {
    if(item.enable == true) {
        this.router.navigate([item.link]);
        this.current_page_id = item.id;
        // console.log('before current_page_id', this.current_page_id);
        this.initSidebar();
    } else {
      return false;
    }
  }
}

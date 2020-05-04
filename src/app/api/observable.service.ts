import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableService {
  private signatureSubject = new Subject<any>();
  private linksSubject = new Subject<any>();
  isRoomsChanged:boolean;
  partiesInfoChanged:boolean;
  unSubscribedLink:Subscription;
  constructor() { }
  completeSignature(signatureUrl: string) {
    this.signatureSubject.next({ signatureUrl: signatureUrl });
  }

  getSignature(): Observable<any> {
    return this.signatureSubject.asObservable();
  }
  setLinks(links:any) {
    this.linksSubject.next({ links: links });
  }
  disableLinks(links,currentPageId) {
    links = links.map(link => {
      if (link.id > currentPageId) {
        link.enable = false;
      }
      return link;
    });
    return links;
  }
  modifyLinks(links, currentPageId, sessionRooms?) {
    let completedRoomsLength;
    if (!!sessionRooms) {
      completedRoomsLength = sessionRooms.filter(item => !!item.complete).length;
    }
    links = links.map(link => {
      if (!sessionRooms) {
        link.enable = (link.id <= 2) ? true : false;
        link.active = (link.id == 2) ? true : false;
      } else {
        link.enable = (link.id <= 3) ? true : false;
        if (completedRoomsLength == sessionRooms.length)
          link.enable = true;
          link.active = (link.id == currentPageId) ? true : false;
      }
      return link;
    });
    this.linksSubject.next({ links: links });
    return links;
  }
  getLinks() {
    return this.linksSubject.asObservable();
  }
}

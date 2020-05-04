import {NgModule} from '@angular/core';
import { leftSidebarComponent } from '../components/left-navbar/left-navbar.component';
import { FilterListComponent } from './filter-list/filter-list.component';
import { BottomMenuComponent } from './bottom-menu/bottom-menu.component';
import { HeaderComponent } from './header/header.component';
import { SortByTypeComponent } from './sort-by-type/sort-by-type.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
    imports: [
        RouterModule,
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule.forChild()],
    declarations: [leftSidebarComponent, FilterListComponent, BottomMenuComponent, HeaderComponent, SortByTypeComponent],
    exports: [leftSidebarComponent, FilterListComponent, BottomMenuComponent, HeaderComponent, SortByTypeComponent],
})

export class ComponentsModule {}

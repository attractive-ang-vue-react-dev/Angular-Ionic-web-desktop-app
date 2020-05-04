    import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'parties',
    loadChildren: () => import('./parties/parties.module').then( m => m.PartiesPageModule)
  },
  {
    path: 'miscellaneous',
    loadChildren: () => import('./miscellaneous/miscellaneous.module').then( m => m.MiscellaneousPageModule)
  },
  {
    path: 'conclusion',
    loadChildren: () => import('./conclusion/conclusion.module').then( m => m.ConclusionPageModule)
  },
  {
    path: 'new-protocol',
    loadChildren: () => import('./new-protocol/new-protocol.module').then( m => m.NewProtocolPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then( m => m.RoomsPageModule)
  },
  {
    path: 'add-room',
    loadChildren: () => import('./add-room/add-room.module').then( m => m.AddRoomPageModule)
  },
  {
    path: 'add-room-inner',
    loadChildren: () => import('./add-room-inner/add-room-inner.module').then( m => m.AddRoomInnerPageModule)
  },
  {
    path: 'room-object',
    loadChildren: () => import('./room-object/room-object.module').then( m => m.RoomObjectPageModule)
  },
  {
    path: 'parties-inner',
    loadChildren: () => import('./parties-inner/parties-inner.module').then( m => m.PartiesInnerPageModule)
  },
  {
    path: 'add-component',
    loadChildren: () => import('./add-component/add-component.module').then( m => m.AddComponentPageModule)
  },
  {
    path: 'request',
    loadChildren: () => import('./request/request.module').then( m => m.RequestPageModule)
  },
  {
    path: 'request-inner',
    loadChildren: () => import('./request-inner/request-inner.module').then( m => m.RequestInnerPageModule)
  },
  {
    path: 'add-room-name',
    loadChildren: () => import('./add-room-name/add-room-name.module').then( m => m.AddRoomRoomNamePageModule)
  },
  {
    path: 'add-room-type',
    loadChildren: () => import('./add-room-type/add-room-type.module').then( m => m.AddRoomRoomTypePageModule)
  },
  {
    path: 'add-new-room-type',
    loadChildren: () => import('./add-new-room-type/add-new-room-type.module').then( m => m.AddRoomNewRoomTypePageModule)
  },
  {
    path: 'add-new-component',
    loadChildren: () => import('./add-new-component/add-new-component.module').then( m => m.AddNewComponentPageModule)
  },
  {
    path: 'conclusion-inner',
    loadChildren: () => import('./conclusion-inner/conclusion-inner.module').then( m => m.ConclusionInnerPageModule)
  },   {
    path: 'image-popup',
    loadChildren: () => import('./image-popup/image-popup.module').then( m => m.ImagePopupPageModule)
  },  {
    path: 'add-floor',
    loadChildren: () => import('./add-floor/add-floor.module').then( m => m.AddFloorPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules,useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

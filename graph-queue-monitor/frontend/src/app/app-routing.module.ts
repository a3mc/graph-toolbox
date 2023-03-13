import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueueComponent } from "./queue/queue.component";
import { StatusComponent } from "./status/status.component";

const routes: Routes = [
    { path: '', redirectTo: '/status', pathMatch: 'full' },
    { path: 'queue', component: QueueComponent },
    { path: 'status', component: StatusComponent },
];

@NgModule( {
    imports: [RouterModule.forRoot( routes, { useHash: true } )],
    exports: [RouterModule]
} )
export class AppRoutingModule {
}

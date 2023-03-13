import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QueueComponent } from './queue/queue.component';
import { HttpClientModule } from "@angular/common/http";
import { ApiClientService } from "./api-client.service";
import { FormsModule } from "@angular/forms";
import { ClipboardModule } from '@angular/cdk/clipboard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StatusComponent } from './status/status.component';

@NgModule( {
    declarations: [
        AppComponent,
        QueueComponent,
        StatusComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,

        BrowserAnimationsModule,
        ClipboardModule,
    ],
    providers: [ApiClientService],
    bootstrap: [AppComponent]
} )
export class AppModule {
}

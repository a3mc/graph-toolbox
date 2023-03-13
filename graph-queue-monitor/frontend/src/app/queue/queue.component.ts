import { Component } from '@angular/core';
import { ApiClientService } from "../api-client.service";
import { take } from "rxjs";

@Component( {
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss']
} )
export class QueueComponent {

    public queue: any = [];
    public refreshTime = 10;
    public limit = 25;
    public loading = false;
    private _refreshInterval: any = null;

    constructor(
        private _apiClientService: ApiClientService,
    ) {
    }

    ngOnInit(): void {
        this._getQueue();
        // Set interval to refresh the queue
        this.setRefresh();
    }

    ngOnDestroy(): void {
        clearInterval( this._refreshInterval );
    }

    public setRefresh(): void {
        if ( this.refreshTime < 1 || isNaN( this.refreshTime ) ) {
            this.refreshTime = 1;
        }
        clearInterval( this._refreshInterval );
        this._refreshInterval = setInterval( () => {
            this._getQueue();
        }, this.refreshTime * 1000 );
    }

    private _getQueue(): void {
        this.loading = true;
        this._apiClientService.get( 'actions-queue?limit=' + this.limit )
            .pipe( take( 1 ) )
            .subscribe( ( data: any ) => {
                this.queue = data;
                this.loading = false;
            } );
    }
}

import { Component } from '@angular/core';
import { take } from "rxjs";
import { ApiClientService } from "../api-client.service";

@Component( {
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss']
} )
export class StatusComponent {
    public loading = false;
    public refreshTime = 300;
    public status: any = {};
    private _refreshInterval: any = null;

    constructor(
        private _apiClientService: ApiClientService,
    ) {
    }

    ngOnInit(): void {
        this._getStatus();
        // Set interval to refresh the status
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
            this._getStatus();
        }, this.refreshTime * 1000 );
    }

    private _getStatus(): void {
        this.loading = true;
        this._apiClientService.get( 'status' )
            .pipe( take( 1 ) )
            .subscribe( ( data: any ) => {
                this.status = data;
                this.loading = false;
            } );
    }
}

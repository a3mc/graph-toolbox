import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
    RestExplorerBindings,
    RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import path from 'path';
import { MySequence } from './sequence';
import { AGENT_POOL_CONNECTION, NODE_POOL_CONNECTION, PgAgentPoolProvider, PgNodePoolProvider } from "./pool.providers";

export { ApplicationConfig };

export class GraphQueueMonitorApplication extends BootMixin(
    ServiceMixin( RepositoryMixin( RestApplication ) ),
) {
    constructor( options: ApplicationConfig = {} ) {
        super( options );

        // Set up the custom sequence
        this.sequence( MySequence );

        // Bing pool providers
        this.bind( AGENT_POOL_CONNECTION ).toProvider( PgAgentPoolProvider );
        this.bind( NODE_POOL_CONNECTION ).toProvider( PgNodePoolProvider );

        // Set up default home page
        this.static( '/', path.join( __dirname, '../public' ) );

        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
}

import { inject } from '@loopback/core';
import {
    Request,
    RestBindings,
    get,
    response,
    ResponseObject,
} from '@loopback/rest';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
    description: 'Ping Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'PingResponse',
                properties: {
                    greeting: { type: 'string' },
                    date: { type: 'string' },
                    url: { type: 'string' },
                    headers: {
                        type: 'object',
                        properties: {
                            'Content-Type': { type: 'string' },
                        },
                        additionalProperties: true,
                    },
                },
            },
        },
    },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
    constructor( @inject( RestBindings.Http.REQUEST ) private req: Request ) {
    }

    // Map to `GET /ping`
    @get( '/ping' )
    @response( 200, PING_RESPONSE )
    ping(): object {
        // Reply with a greeting
        return {
            status: 'Ok',
        };
    }
}

import { Client, expect } from '@loopback/testlab';
import { GraphQueueMonitorApplication } from '../..';
import { setupApplication } from './test-helper';

describe( 'ActionsQueueController', () => {
    let app: GraphQueueMonitorApplication;
    let client: Client;

    before( 'setupApplication', async () => {
        process.env.USE_MOCKS = 'true';
        ( { app, client } = await setupApplication() );
    } );

    after( async () => {
        await app.stop();
    } );

    it( 'invokes GET /actions-queue using mock data', async () => {
        const res = await client.get( '/actions-queue' ).expect( 200 );
        expect( res.body[0] ).to.containEql(
            {
                id: 2166,
                type: 'reallocate',
                status: 'success',
                priority: 0,
                deploymentID: 'QmeGpvmEKqwf21YauM95vS6jsCDBjcXoa1KeQppde5tWbh',
                allocationID: '0x22Edc9e9E96DDF383B1255375886D21114431673',
                amount: '66000.0',
                poi: null,
                force: null,
                source: 'indexerAgent',
                reason: 'deployment:always:allocationExpiring',
                createdAt: '2023-02-07T12:31:12.263Z',
                updatedAt: '2023-02-07T12:32:54.544Z',
                transaction: '0x827cad52dde9c03f3f7c253c5d552c045d11d22086ca1fa6b8a9dd8bae2970с4',
                failureReason: null
            },
        );
    } );

    it( 'invokes GET /actions-queue passing a limit', async () => {
        const res = await client.get( '/actions-queue?limit=2' ).expect( 200 );
        expect( res.body.length ).to.equal( 2 );
    } );

    it( 'invokes GET /status', async () => {
        const res = await client.get( '/status' ).expect( 200 );
        expect( res.body.rules ).to.containEql(
            {
                id: 117,
                identifier: 'QmeGpvmEKqwf21YauM95vS6jsCDBjcXoa1KeQppde5tWbh',
                identifierType: 'deployment',
                allocationAmount: '21000000000000000000000',
                allocationLifetime: null,
                autoRenewal: true,
                parallelAllocations: null,
                maxAllocationPercentage: null,
                minSignal: null,
                minStake: null,
                maxSignal: null,
                minAverageQueryFees: null,
                custom: null,
                decisionBasis: 'always',
                requireSupported: true,
                createdAt: '2023-02-01T15:47:06.791Z',
                updatedAt: '2023-02-03T06:49:20.596Z'
            },
        );
    } );
} );

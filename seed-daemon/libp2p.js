import { tcp } from '@libp2p/tcp'
import { identify } from '@libp2p/identify'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { webSockets } from '@libp2p/websockets'
import { webTransport } from '@libp2p/webtransport'
import { webRTC, webRTCDirect } from '@libp2p/webrtc'
import { bootstrap } from '@libp2p/bootstrap'
import { circuitRelayTransport, circuitRelayServer } from '@libp2p/circuit-relay-v2'
import { MemoryDatastore } from 'datastore-core'

const datastore = new MemoryDatastore()

export const Libp2pOptions = {
	datastore,
	addresses: {
		listen: [
			'/ip4/0.0.0.0/tcp/4001',
			'/ip4/0.0.0.0/tcp/4004/ws'
		]
	},
	peerDiscovery: [
		bootstrap({
			list: [
				'/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
				'/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTf6NAdaAk6BPfiFHDf',
				'/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
				'/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
			]
		}),
	],
	transports: [
		tcp(),
		webSockets(),
		webTransport(),
		webRTC(),
		webRTCDirect(),
		circuitRelayTransport({
			discoverRelays: 1
		})
	],
	connectionEncrypters: [noise()],
	streamMuxers: [yamux()],
	services: {
		identify: identify(),
		pubsub: gossipsub({ allowPublishToZeroPeers: true }),
		relay: circuitRelayServer()
	}
}

import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { Libp2pOptions } from './libp2p.js';
import { MemoryBlockstore } from 'blockstore-core'

// Simple console logging with colors
const colors = {
	reset: "\x1b[0m",
	green: "\x1b[32m",
	cyan: "\x1b[36m",
	red: "\x1b[31m",
	yellow: "\x1b[33m",
};

const log = (message, color = colors.cyan) => {
	const timestamp = new Date().toLocaleTimeString();
	console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
};

async function main() {
	log('🚀 Starting Helia daemon...');

	const blockstore = new MemoryBlockstore();

	const libp2p = await createLibp2p(Libp2pOptions);

	const helia = await createHelia({
		blockstore,
		libp2p
	});

	log('🎉 Helia node is online!', colors.green);
	log(`🔌 Peer ID: ${colors.yellow}${helia.libp2p.peerId.toString()}${colors.reset}`);

	const displayAddrs = () => {
		const addrs = helia.libp2p.getMultiaddrs().map((a) => a.toString());
		log('--------------------------------------------------');
		log('Listening on addresses:', colors.green);
		addrs.forEach(addr => log(`  - ${addr}`, colors.green));
		log(`🌐 Connected to ${helia.libp2p.getPeers().length} peers.`);
		log('--------------------------------------------------');
	};

	// --- Event listeners for libp2p ---
	helia.libp2p.addEventListener('peer:connect', (evt) => {
		const peerId = evt.detail.toString();
		log(`🤝 Connected to ${colors.yellow}${peerId}`, colors.green);
	});

	helia.libp2p.addEventListener('peer:disconnect', (evt) => {
		const peerId = evt.detail.toString();
		log(`👋 Disconnected from ${colors.yellow}${peerId}`, colors.red);
	});

	// Display addresses initially and then every 30 seconds
	displayAddrs();
	setInterval(displayAddrs, 30000);

	// --- Graceful Shutdown ---
	const stop = async () => {
		log('\n🛑 Shutting down Helia node...', colors.yellow);
		await helia.stop();
		log('✅ Node stopped.', colors.green);
		process.exit(0);
	};

	process.on('SIGINT', stop);
	process.on('SIGTERM', stop);
}

// Start the daemon
main().catch(err => {
	log(`🚨 Critical Error: ${err}`, colors.red);
	console.error(err);
	process.exit(1);
});



import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules/recharts')) return 'vendor-recharts';
					if (id.includes('node_modules/@hello-pangea/dnd')) return 'vendor-dnd';
					if (id.includes('node_modules')) return 'vendor';
				},
			},
		},
	},
});

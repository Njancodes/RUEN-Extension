import esbuild from 'esbuild';

async function build() {
    try {
        // Build background script
        await esbuild.build({
            entryPoints: ['background.js'],
            bundle: true,
            outfile: 'dist/background.js',
            format: 'iife'
        });
        
        // Build content script
        await esbuild.build({
            entryPoints: ['content.js'],
            bundle: true,
            outfile: 'dist/content.js',
            format: 'iife'
        });
        
        console.log('✅ Build successful!');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

build();
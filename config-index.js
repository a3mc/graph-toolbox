import fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const configsDir = [__dirname, 'configs'].join('/');
const configs = [];
const loadConfigs = async () => {
    const files = await fs.readdir(configsDir);
    for (const file of files) {
        if (file === 'README.md') {
            continue;
        }
        const filePath = path.join(configsDir, file);
        const configModule = await import(filePath);
        const config = configModule.default;
        configs.push(config)
    }
    if (!configs.length) {
        console.warn('No configs found in configs directory. You can copy example from example-configs directory or create your own.');
    }
    return configs;
};

export default loadConfigs();

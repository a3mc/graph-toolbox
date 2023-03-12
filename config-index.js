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
        if (file === 'index.js') {
            continue;
        }
        const filePath = path.join(configsDir, file);
        const configModule = await import(filePath);
        const config = configModule.default;
        configs.push(config)
    }
    return configs;
};

export default loadConfigs();

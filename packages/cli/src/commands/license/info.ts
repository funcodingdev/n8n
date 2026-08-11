import { Command } from '@n8n/decorators';

import { BaseCommand } from '../base-command';

@Command({
	name: 'license:info',
	description: 'Print license information',
})
export class LicenseInfoCommand extends BaseCommand {
	async run() {
		this.initLicense();

		// 直接写入 stdout，确保输出不受 N8N_LOG_LEVEL 影响。
		process.stdout.write(this.license.getInfo() + '\n');
	}

	async catch(error: Error) {
		process.stderr.write('\nGOT ERROR\n');
		process.stderr.write('====================================\n');
		process.stderr.write(error.message + '\n');
	}
}

import { Command } from '@n8n/decorators';

import { BaseCommand } from '../base-command';

@Command({
	name: 'license:clear',
	description: 'Clear local license certificate',
})
export class ClearLicenseCommand extends BaseCommand {
	async run() {
		this.initLicense();
		this.logger.info(
			'Enterprise mock license is always enabled; there is no certificate to clear.',
		);
	}

	async catch(error: Error) {
		this.logger.error('Error. See log messages for details.');
		this.logger.error('\nGOT ERROR');
		this.logger.info('====================================');
		this.logger.error(error.message);
		this.logger.error(error.stack!);
	}
}

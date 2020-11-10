const npmPackage = require('../../package.json');
import Route from './Route';
import HTTPRequest from "./http/HTTPRequest";
import Calendar from 'src/api/calendar';

/**
 * Route: /
 */
class IndexRoute extends Route<void> {

	public expectedData: never;

	public handle(request: HTTPRequest<void>) {
		request.sendJsonPayload({
			version: npmPackage.version,
			msg: 'Welcome on the api of GarageISEP'
		});
	}
}


export default IndexRoute;
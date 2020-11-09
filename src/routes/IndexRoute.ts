import * as npmPackage from '../../package.json';
import Route from './Route';
import HTTPRequest from "./http/HTTPRequest";

/**
 * Route: /
 */
class IndexRoute extends Route {

	public handle(request: HTTPRequest<void>) {
		request.sendJsonPayload({
			version: npmPackage.version,
			msg: 'Welcome on the api of GarageISEP'
		});
	}
}


export default IndexRoute;
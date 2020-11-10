import HTTPRequest from "../http/HTTPRequest";
import Route from "../Route";

/**
 * Route: /calendar
 */
class CalendarIndexRoute extends Route<void> {
	public expectedData: never;

	public handle(request: HTTPRequest<void>) {
		request.sendJsonVersion("Here you can find all of our events");
	}
}

export default CalendarIndexRoute;
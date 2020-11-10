import { Router } from "express";
import Logger from "../utils/Logger";
import HTTPRequest from "./http/HTTPRequest";
import Calendar from "../api/calendar/";

import IndexRoute from "./IndexRoute";
import CalendarIndexRoute from "./calendar/CalendarIndexRoute";
import CalendarListRoute from "./calendar/calendarList/CalendarListRoute";
import CalendarEventsRoute from "./calendar/calendarEvents/CalendarEventsRoute";
import CalendarAllEventsRoute from "./calendar/calendarAllEvents/CalendarAllEventsRoute";
import CalendarAddParticipantRoute from "./calendar/calendarAddParticipant/CalendarAddParticipantRoute";

class RouteManager {
	public router: Router = Router();

	private readonly _logger = new Logger(this);
	private _calendarAPI: Calendar;
	
	private _routes: {
		[key: string]: {
			route: any,	//Typeof Route but error because of type parameter
			type: "POST"|"GET",
			verifyParams: boolean
		}
	}

	public async init() {
		this._setRoutes();
		this._calendarAPI = await new Calendar().init();

		for (const routeKey in this._routes) {
			const routeParams = this._routes[routeKey];
			const route = new routeParams.route(this._calendarAPI)

			this._logger.log(routeParams.type, routeKey);
			
			if (routeParams.type == "GET")
				this.router.get(routeKey, (req, res) => new HTTPRequest(req, res, route, routeParams.verifyParams).handleRequest())
			else if (routeParams.type = "POST")
				this.router.post(routeKey, (req, res) => new HTTPRequest(req, res, route, routeParams.verifyParams).handleRequest())
		}
	}

	private _setRoutes() {
		this._routes = {
			"/": {
				route: IndexRoute,
				type: "GET",
				verifyParams: false,
			},
			"/calendar": {
				route: CalendarIndexRoute,
				type: "GET",
				verifyParams: false,
			},
			"/calendar/all": {
				route: CalendarListRoute,
				type: "GET",
				verifyParams: false
			},
			"/calendar/all/events": {
				route: CalendarAllEventsRoute,
				type: "POST",
				verifyParams: false,
			},
			"/calendar/:calendarId/events": {
				route: CalendarEventsRoute,
				type: "POST",
				verifyParams: true
			},
			"/calendar/:calendarId/events/:eventId/addParticipant": {
				route: CalendarAddParticipantRoute,
				type: "POST",
				verifyParams: true
			}
		}
	}
}

export default RouteManager;

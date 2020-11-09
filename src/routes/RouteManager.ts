import { Router } from "express";
import Logger from "../utils/Logger";
import HTTPRequest from "./http/HTTPRequest";
import IndexRoute from "./IndexRoute";
import Route from "./Route";

class RouteManager {
	public router: Router = Router();

	private readonly _logger = new Logger(this);

	private _routes: {
		[key: string]: {
			route: (typeof Route | typeof IndexRoute),
			type: "POST"|"GET"
		}
	}

	public init() {
		this._setRoutes();

		for (const routeKey in this._routes) {
			const routeParams = this._routes[routeKey];
			const route = new routeParams.route()

			this._logger.log(routeParams.type, routeKey);
			
			if (routeParams.type == "GET")
				this.router.get(routeKey, (req, res) => new HTTPRequest(req, res, route).handleRequest())
			else if (routeParams.type = "POST")
				this.router.post(routeKey, (req, res) => new HTTPRequest(req, res, route).handleRequest())
		}
	}

	private _setRoutes() {
		this._routes = {
			"/": {
				route: IndexRoute,
				type: "GET"
			},
			"/calendar": {
				route: RouteCalendar,
				type: "GET"
			}
		}
	}
}

export default RouteManager;

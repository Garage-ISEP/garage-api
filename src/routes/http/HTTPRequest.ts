import { Response, Request } from 'express';
import Route from '../Route';
const jsonPackage = require("../../../package.json");

class HTTPRequest<Body> {
	public body: Body;

	constructor(
		public request: Request,
		private _response: Response,
		protected _route: Route<Body>,
		private _checkParams: boolean
	) {
		this.body = { ...this.request.body, ...this.request.query, ...this.request.params };
	}

	public handleRequest() {
		//Checking expected parameters
		if (this._checkParams) {
			this._route.logger.log("Params", this.body);
			const res = this.checkBody(this._route.expectedData);
			if (!res.success) {
				this.sendJson400Error(res.payload);
				return;
			}
		}
		this._route.handle(this);
	}

	/**
	 * Vérifie que le corp de la requête est bien constitué de tous les paramètres demandés
	 * Renvoie un object avec les clef de la requete et true si le paramêtre est spécifié ou false si il ne l'est pas
	 */
	public checkBody(expectedData: (keyof Body)[]): { success: boolean, payload: { [Key in keyof Body]: boolean } } {
		const response: { [Key in keyof Body]: boolean } = {} as { [Key in keyof Body]: boolean };
		let success: boolean = true;
		for (const expectedKey of expectedData) {
			if (this.body[expectedKey] == undefined) {
				response[expectedKey] = false;
				success = false;
			} else
				response[expectedKey] = true;
		}
		return { success: success, payload: response };
	}

	public sendJsonPayload<JSONResponse>(payload: JSONResponse, code: number = 200) {
		this._response.json({ code: code, payload: payload })
	}

	public sendJson400Error(payload: { [Key in keyof Partial<Body>]: boolean }) {
		this.sendJsonError("Missing Request Params", 400, payload);
	}

	public sendJsonError<JSONResponse>(message: string = "Internal Server Error", code: number = 500, payload?: JSONResponse ) {
		this._response.status(code).json({ code: code, message: message, payload: payload });
	}

	public sendJsonVersion(msg: string) {
		this.sendJsonPayload({
			status: 200,
			version: jsonPackage.version,
			msg: msg
		});
	}
}

export default HTTPRequest;
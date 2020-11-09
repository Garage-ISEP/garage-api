import { Response, Request } from 'express';
import Route from '../Route';

class HTTPRequest<JSONBody> {
	public jsonBody: JSONBody;

	constructor(
		public request: Request,
		private _response: Response,
		protected _route: Route
	) {
		this.jsonBody = { ...this.request.body, ...this.request.query, ...this.request.params };
	}

	public handleRequest() {
		this._route.logger.log("Params", this.jsonBody);
		this._route.handle(this);
	}

	/**
	 * Vérifie que le corp de la requête est bien constitué de tous les paramètres demandés
	 * Renvoie un object avec les clef de la requete et true si le paramêtre est spécifié ou false si il ne l'est pas
	 * @param expectedData 
	 */
	public checkJSONBody(expectedData: (keyof JSONBody)[]): { success: boolean, payload: { [Key in keyof JSONBody]: boolean } } {
		const response: { [Key in keyof JSONBody]: boolean } = {} as { [Key in keyof JSONBody]: boolean };
		let success: boolean = true;
		for (const expectedKey of expectedData) {
			if (this.jsonBody[expectedKey] == undefined) {
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

	public sendJsonError(message: string, code: number, payload?: { [Key in keyof Partial<JSONBody>]: boolean }) {
		this._response.status(code).json({ code: code, message: message, payload: payload });
	}
}

export default HTTPRequest;
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";

import Logger from "./utils/Logger";
import RouteManager from "./routes/RouteManager";

class App {
	public readonly app: express.Application = express();
	private readonly _routeManager: RouteManager = new RouteManager();
	private _logger: Logger = new Logger(this);

	public async init() {
		dotenv.config();

		this.app.use(logger(process.env.NODE_ENV === "production" ? "combined" : "dev"))
		this.app.set('trust proxy', true);
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(cookieParser());
		this.app.use(bodyParser.json());
		this.app.use(cors());
	
		await this._routeManager.init();
		this.app.use(this._routeManager.router);

		this.app.listen(process.env.PORT ?? 3000, () => this._onListening());
	}

	private _onListening() {
		this._logger.log("Server started");
		this._logger.log("Listening on port", process.env.PORT ?? 3000);
	}
}

export default new App().init();
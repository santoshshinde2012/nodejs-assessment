import cors from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import http from 'http';
import helmet from 'helmet';
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GitHubStrategy, Profile } from 'passport-github';
import database from './database';
import swaggerDocument from '../swagger.json';
import registerRoutes from './routes';
import addErrorHandler from './middleware/error-handler';
import logger from './lib/logger';
import { isAuthenticated } from './middleware/authentication-middleware';

export default class App {
	public express: Application;

	public httpServer: http.Server;

	public async init(): Promise<void> {
		this.express = express();
		this.httpServer = http.createServer(this.express);

		// Assert database connection
		await this.assertDatabaseConnection();

		// passport
		this.initPassport();

		// add all global middleware like cors
		this.middleware();

		// // register the all routes
		this.routes();

		// add the middleware to handle error, make sure to add if after registering routes method
		this.express.use(addErrorHandler);

		// In a development/test environment, Swagger will be enabled.
		if (process.env.NODE_ENV !== 'prod') {
			this.setupSwaggerDocs();
		}
	}

	/**
	 * here register your all routes
	 */
	private routes(): void {
		this.express.get('/', isAuthenticated, this.basePathRoute);
		this.express.get('/login/github', passport.authenticate('github'));
		this.express.get(
			'/login/github/callback',
			passport.authenticate('github', { failureRedirect: '/logout' }),
			(req: Request, res: Response) => {
				res.redirect('/web');
			},
		);
		this.express.use('/api', registerRoutes());
		this.express.get(
			'/web',
			this.parseRequestHeader,
			this.basePathRoute,
		);
		this.express.get('/logout', this.logout);
	}

	/**
	 * here you can apply your middlewares
	 */
	private middleware(): void {
		// support application/json type post data
		// support application/x-www-form-urlencoded post data
		// Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
		this.express.use(helmet({ contentSecurityPolicy: false }));
		this.express.use(express.json({ limit: '100mb' }));
		this.express.use(
			express.urlencoded({ limit: '100mb', extended: true }),
		);
		// add multiple cors options as per your use
		const corsOptions = {
			origin: [
				'http://localhost:8080/',
				'http://example.com/',
				'http://127.0.0.1:8080',
			],
		};
		this.express.use(cors(corsOptions));
	}

	private parseRequestHeader(
		_req: Request,
		_res: Response,
		next: Function,
	): void {
		// parse request header
		// console.log(req.headers.access_token);
		next();
	}

	private basePathRoute(_request: Request, response: Response): void {
		response.json({ message: 'base path' });
	}

	private async assertDatabaseConnection(): Promise<void> {
		try {
			await database.authenticate();
			await database.sync();
			logger.info('Connection has been established successfully.');
		} catch (error) {
			logger.error('Unable to connect to the database:', error);
		}
	}

	private setupSwaggerDocs(): void {
		this.express.use(
			'/docs',
			swaggerUi.serve,
			swaggerUi.setup(swaggerDocument),
		);
	}

	private initPassport(): void {
		this.express.use(
			session({
				secret: process.env.SESSION_STORE_SECRETE,
				resave: false,
				saveUninitialized: true,
			}),
		);
		this.express.use(passport.initialize());
		this.express.use(passport.session());

		const { CLIENT_ID, CLIENT_SECRETE, CALLBACK_URL } = process.env;

		if (CLIENT_ID && CLIENT_SECRETE && CALLBACK_URL) {
			// please add your credentials in .env file
			const gitHubStrategyOptions = {
				clientID: CLIENT_ID,
				clientSecret: CLIENT_SECRETE,
				callbackURL: CALLBACK_URL,
			};
			passport.use(
				new GitHubStrategy(
					gitHubStrategyOptions,
					(
						_accessToken: string,
						_refreshToken: string,
						profile: Profile,
						cb,
					) => {
						cb(null, profile);
					},
				),
			);

			passport.serializeUser((user: Profile, done) => {
				done(null, user);
			});

			passport.deserializeUser((user: Profile, done) => {
				done(null, user);
			});
		}

	}

	private logout(
		request: Request,
		response: Response,
		_next: NextFunction,
	): void {
		try {
			request.logout((error) => logger.error(error));
			response.redirect('/login/github');
		} catch (error) {
			logger.error('Error during logout:', error);
			response.status(500).send('Error during logout');
		}
	}
}

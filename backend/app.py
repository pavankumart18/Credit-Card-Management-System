from flask import Flask, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import mongoengine
from services.logging_service import log_request_performance, logging_service

# Load environment variables
load_dotenv()

# Initialize extensions
db = mongoengine

def create_app(config_name=None):
	"""Application factory pattern"""
	app = Flask(__name__)
	
	# Disable strict slashes BEFORE everything else
	app.url_map.strict_slashes = False
	
	# Load configuration
	if config_name is None:
		config_name = os.environ.get('FLASK_ENV', 'development')
	
	if config_name == 'production':
		app.config.from_object('config.ProductionConfig')
	elif config_name == 'testing':
		app.config.from_object('config.TestingConfig')
	else:
		app.config.from_object('config.DevelopmentConfig')
	
	# Set JWT secret for auth service
	app.config['JWT_SECRET_KEY'] = app.config.get('JWT_SECRET_KEY', 'jwt-secret-string')
	
	# Initialize extensions with app
	db.connect(host=app.config['MONGODB_SETTINGS']['host'])
	
	# Add request logging middleware BEFORE CORS
	@app.before_request
	def log_request():
		print(f"\n📥 Incoming Request:")
		print(f"   Method: {request.method}")
		print(f"   Path: {request.path}")
		print(f"   Origin: {request.headers.get('Origin', 'No origin')}")
		if request.method in ['POST', 'PUT']:
			print(f"   Body: {request.get_json(silent=True)}")
	
	# Configure CORS - Simple setup
	CORS(app)
	
	# Add CORS headers manually for better control
	@app.after_request
	def after_request(response):
		origin = request.headers.get('Origin')
		if origin:
			response.headers['Access-Control-Allow-Origin'] = origin
		response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
		response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
		response.headers['Access-Control-Allow-Credentials'] = 'true'
		# Log response details
		try:
			response_data = response.get_json() if response.is_json else str(response.data[:100])
			print(f"📤 Response: {response.status_code} to {origin} | Data: {response_data}")
		except:
			print(f"📤 Response: {response.status_code} to {origin}")
		return response
	
	# Register blueprints
	from routes.users import users_bp
	from routes.products import products_bp
	from routes.orders import orders_bp
	from routes.chat import chat_bp
	from routes.cards import cards_bp
	from routes.transactions import transactions_bp
	from routes.bills import bills_bp
	from routes.emis import emis_bp
	from routes.cibil_scores import cibil_scores_bp
	from routes.notifications import notifications_bp
	
	app.register_blueprint(users_bp, url_prefix='/api/users')
	app.register_blueprint(products_bp, url_prefix='/api/products')
	app.register_blueprint(orders_bp, url_prefix='/api/orders')
	app.register_blueprint(chat_bp, url_prefix='/api/chat')
	app.register_blueprint(cards_bp, url_prefix='/api/cards')
	app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
	app.register_blueprint(bills_bp, url_prefix='/api/bills')
	app.register_blueprint(emis_bp, url_prefix='/api/emis')
	app.register_blueprint(cibil_scores_bp, url_prefix='/api/cibil')
	app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
	
	# Health check endpoint
	@app.route('/health')
	@log_request_performance
	def health_check():
		try:
			# Test MongoDB connection
			from mongoengine import get_connection
			connection = get_connection()
			connection.admin.command('ping')
			return {'status': 'healthy', 'message': 'Flask backend with MongoDB is running', 'database': 'connected'}, 200
		except Exception as e:
			logging_service.log_error('HealthCheck', str(e))
			return {'status': 'unhealthy', 'message': 'MongoDB connection failed', 'error': str(e)}, 500
	
	# Error handlers
	@app.errorhandler(404)
	def not_found(error):
		return {'error': 'Not found'}, 404
	
	@app.errorhandler(500)
	def internal_error(error):
		return {'error': 'Internal server error'}, 500
	
	return app

if __name__ == '__main__':
	app = create_app()
	print("\n" + "="*60)
	print("🚀 Flask Backend Starting...")
	print("📍 URL: http://127.0.0.1:5001")
	print("📊 Health Check: http://127.0.0.1:5001/health")
	print("📊 API Endpoints: http://127.0.0.1:5001/api/")
	print("="*60 + "\n")
	app.run(debug=True, host='127.0.0.1', port=5001, use_reloader=False)

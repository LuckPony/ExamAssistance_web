# varies
APP_NAME = examassistance_web
BUILD_DIR = dist
DEPLOY_DIR = /var/www/Exam_assistance_web
DEPLOY_USER = root
DEPLOY_HOST = 113.44.59.175


build:
	@echo "building🚀..."
	npm run build

deploy: build
	@echo "sending🤡..."
	ssh $(DEPLOY_USER)@$(DEPLOY_HOST) "rm -rf $(DEPLOY_DIR)/*"
	scp -r $(BUILD_DIR)/* $(DEPLOY_USER)@$(DEPLOY_HOST):$(DEPLOY_DIR)

clean:
	@echo "cleaning🧹..."
	rm -rf $(BUILD_DIR)
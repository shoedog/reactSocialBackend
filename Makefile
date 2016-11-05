# Tie version to latest git hash for master branch.
CURRENT_VERSION = $(shell git rev-parse master)

# Name of image to push.
DOCKER_IMAGE = moonwalk-backend

# ECS container registry (where docker image is stored).
DOCKER_DEPLOY_IMAGE = 328619549554.dkr.ecr.us-west-2.amazonaws.com/moonwalk-backend

run:
	docker run --name moonwalk-backend -p 5000:5000 $(DOCKER_IMAGE)

.PHONY: tests
tests:
	docker run -ti $(DOCKER_ARGS) $(DOCKER_IMAGE)
	docker exec -ti `docker ps | grep moonwalk | awk '{print $1}'` npm test
	docker stop `docker ps | grep moonwalk | awk '{print $1}'`

# docker hub
docker-build:
	docker build -t $(DOCKER_IMAGE) .

docker-push:
	eval `aws ecr get-login --region us-west-2`
	docker tag $(DOCKER_IMAGE) $(DOCKER_DEPLOY_IMAGE):$(CURRENT_VERSION)
	docker push $(DOCKER_DEPLOY_IMAGE):$(CURRENT_VERSION)

# deploy
.PHONY: deploy
deploy:
	deploy/ecs-deploy.sh moonwalk-backend moonwalk-backend-service $(DOCKER_DEPLOY_IMAGE):$(CURRENT_VERSION)

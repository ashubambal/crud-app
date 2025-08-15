pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        SONAR_TOKEN = credentials('sonar-token')
        SONAR_ORGANIZATION = 'jenkins-projects-cicd'
        SONAR_PROJECT_KEY = 'jenkins-projects-cicd'

        DB_HOST = 'testdb-1.cp24ccc4chcf.ap-southeast-1.rds.amazonaws.com'
        DB_NAME = 'testdb_1'
    }

    stages {

        stage('Code-Analysis') {
            steps {
                withSonarQubeEnv('SonarCloud') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \
                      -Dsonar.organization=jenkins-projects-cicd \
                      -Dsonar.projectKey=jenkins-projects-cicd \
                      -Dsonar.sources=. \
                      -Dsonar.host.url=https://sonarcloud.io'''
                }
            }
        }

        stage('Docker Build And Push') {
            steps {
                script {
                    docker.withRegistry('', 'docker-cred') {
                        def image = docker.build("softconsist/crud-123:latest")
                        image.push()
                    }
                }
            }
        }

        stage('Deploy To EC2') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'mysql-cred', usernameVariable: 'DB_USER', passwordVariable: 'DB_PASSWORD')]) {
                    sh '''
                        docker rm -f $(docker ps -q) || true

                        docker run -d -p 3000:3000 \
                          -e DB_HOST=$DB_HOST \
                          -e DB_NAME=$DB_NAME \
                          -e DB_USER=$DB_USER \
                          -e DB_PASSWORD=$DB_PASSWORD \
                          softconsist/crud-123:latest
                    '''
                }
            }
        }

    }
}


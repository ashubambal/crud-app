pipeline {
    agent any

    environment {
        SCANNER_HOME = tool 'SonarQubeScanner' // Make sure the scanner is configured in Jenkins Global Tools
    }

    stages {

        stage('Code-Analysis') {
            steps {
                withSonarQubeEnv('SonarCloud') {
                    sh '''$SCANNER_HOME/bin/sonar-scanner \
  -Dsonar.organization=ashubambal \
  -Dsonar.projectKey=ashubambal \
  -Dsonar.sources=. \
  -Dsonar.host.url=https://sonarcloud.io'''
                }
            }
        }

        stage('Sonar Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Build And Push') {
            steps {
                script {
                    docker.withRegistry('', 'docker-cred') {
                        def buildNumber = env.BUILD_NUMBER ?: '1'
                        def image = docker.build("softconsist/crud-123:latest")
                        image.push()
                    }
                }
            }
        }

        stage('Deploy To EC2') {
            steps {
                script {
                    // Clean up any running containers before deploying
                    sh 'docker rm -f $(docker ps -q) || true'
                    sh 'docker run -d -p 3000:3000 softconsist/crud-123:latest'
                }
            }
        }

    }
}


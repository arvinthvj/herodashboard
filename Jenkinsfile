pipeline {
   agent { docker { image 'node:12.16.1' } }
   options {
   disableConcurrentBuilds()
   timeout(time: 10, unit: 'MINUTES')
   buildDiscarder(logRotator(numToKeepStr: '10'))
 } // options
   environment {
       HOME = '.'
   // Slack configuration
   SLACK_COLOR_DANGER  = '#E01563'
   SLACK_COLOR_INFO    = '#6ECADC'
   SLACK_COLOR_WARNING = '#FFC300'
   SLACK_COLOR_GOOD    = '#3EB991'
   }
 stages {
   stage ('Webhook SCM') {
     steps {
       script {
               properties([pipelineTriggers([githubPush()])])
               // sh "echo 'REACT_APP_WEATHER_API_KEY = staging' >> .env.staging"
               // sh "cat .env.staging"
               sh "npm install"
           }
         }
       }
       stage('get_commit_details') {
           steps {
             script {
               env.GIT_COMMIT_MSG = sh (script: 'git log -1 --pretty=%B ${GIT_COMMIT}', returnStdout: true).trim()
               env.GIT_COMMIT_NAME = sh (script: 'git log -1 --pretty=%cn ${GIT_COMMIT}', returnStdout: true).trim()
               env.GIT_AUTHOR = sh (script: 'git log -1 --pretty=%an ${GIT_COMMIT}', returnStdout: true).trim()
               env.GIT_COMMITTER_EMAIL = sh (script: 'git log -1 --pretty=%ae ${GIT_COMMIT}', returnStdout: true).trim()
           }
       }
   }
       stage('Staging') {
         when {
           branch 'staging'
         }
          steps {
              	script {
                properties([pipelineTriggers([githubPush()])])
                // sh "echo 'REACT_APP_WEATHER_API_KEY = staging' >> .env.staging"
                // sh "cat .env.staging"
                sh "npm run build:staging"
                sh "ls -la build"
            }
            withAWS(region:'us-east-1',credentials:'avhero') {
              s3Upload(bucket: 'stage.avhero.app', workingDir:'build', includePathPattern:'**/*');
            }
            withAWS(credentials:'avhero') {
              cfInvalidate(distribution:'EO5A3JKMXEJIE', paths:['/*'])
            }
          }
       }
       stage('Production') {
         when {
           branch 'master'
         }
         steps {
               script {
                properties([pipelineTriggers([githubPush()])])
                // sh "echo 'REACT_APP_WEATHER_API_KEY = staging' >> .env.staging"
                // sh "cat .env.staging"
                sh "npm run build:production"
                sh "ls -la build"
            }
           withAWS(region:'us-east-1',credentials:'avhero') {
             s3Upload(bucket: 'app.avhero.app', workingDir:'build', includePathPattern:'**/*');
           }
           withAWS(credentials:'avhero') {
              cfInvalidate(distribution:'EIKIRBKSWZRMB', paths:['/*'])
           }
           withAWS(credentials:'avhero') {
              cfInvalidate(distribution:'E24K4ROFI1JWGD', paths:['/*'])
           } 
         }
       }
   }
 post {
   aborted {
     echo "Sending message to Slack"
     slackSend (color: "${env.SLACK_COLOR_WARNING}",
                channel: "#avhero",
                baseUrl: "https://bitcot.slack.com/services/hooks/jenkins-ci/",
                teamDomain: "bitcot.slack.com",
                token: "AvXhNuVx45BMhWMGXyaCerHA",
                username: "jenkins",                  
                message: "*ABORTED:* Job: ${env.JOB_NAME}\n Build Report: ${env.BUILD_URL}\n Commited by: ${env.GIT_COMMIT_NAME}\n Author Name: ${env.GIT_AUTHOR}\n Last commit message: ${env.GIT_COMMIT_MSG}")
   } // aborted
   failure {
     echo "Sending message to Slack"
     slackSend (color: "${env.SLACK_COLOR_DANGER}",
                channel: "#avhero",
                baseUrl: "https://bitcot.slack.com/services/hooks/jenkins-ci/",
                teamDomain: "bitcot.slack.com",
                token: "AvXhNuVx45BMhWMGXyaCerHA",
                username: "jenkins",
                message: "*FAILED:* Job: ${env.JOB_NAME}\n Build Report: ${env.BUILD_URL}\n Commited by: ${env.GIT_COMMIT_NAME}\n Author Name: ${env.GIT_AUTHOR}\n Last commit message: ${env.GIT_COMMIT_MSG}")
   } // failure
   success {
     echo "Sending message to Slack"
     slackSend (color: "${env.SLACK_COLOR_GOOD}",
                channel: "#avhero",
                baseUrl: "https://bitcot.slack.com/services/hooks/jenkins-ci/",
                teamDomain: "bitcot.slack.com",
                token: "AvXhNuVx45BMhWMGXyaCerHA",
                username: "jenkins",
                message: "*SUCCESS:* Job: ${env.JOB_NAME}\n Build Report: ${env.BUILD_URL}\n Commited by: ${env.GIT_COMMIT_NAME}\n Author Name: ${env.GIT_AUTHOR}\n Last commit message: ${env.GIT_COMMIT_MSG}")
   } // success
 } // post
} // pipeline